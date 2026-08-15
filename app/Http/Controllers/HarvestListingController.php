<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use App\Models\HarvestListing;
use App\Services\WithdrawalService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HarvestListingController extends Controller
{
    protected WithdrawalService $withdrawalService;

    public function __construct(WithdrawalService $withdrawalService)
    {
        $this->withdrawalService = $withdrawalService;
    }

    /**
     * Display farmer's harvest listings and active cycles ready for listing.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $listings = HarvestListing::where('user_id', $user->id)
            ->with(['cycle.coop.farm', 'contracts.buyer'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get user's active cycles to create new listing from
        $activeCycles = Cycle::whereHas('coop.farm', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'active')
          ->with(['coop.farm', 'dailyRecords' => function ($dr) {
              $dr->orderBy('day_number', 'desc');
          }, 'healthRecords'])
          ->get();

        $eligibleCycles = $activeCycles->map(function ($cycle) {
            $latestRecord = $cycle->dailyRecords->first();
            $withdrawalStatus = $this->withdrawalService->getWithdrawalStatus($cycle->id, $cycle->healthRecords);
            
            $docDate = Carbon::parse($cycle->doc_date);
            $currentAge = $docDate->diffInDays(Carbon::today()) + 1;
            $livePop = $latestRecord ? (int) $latestRecord->live_population : (int) $cycle->doc_count;
            $avgWeightG = $latestRecord && $latestRecord->avg_weight_g > 0 ? (float) $latestRecord->avg_weight_g : 1800;
            $estTotalWeightKg = round(($livePop * $avgWeightG) / 1000, 2);

            return [
                'id' => $cycle->id,
                'coop_code' => $cycle->coop->coop_code,
                'farm_id' => $cycle->coop->farm_id,
                'farm_name' => $cycle->coop->farm->name,
                'species' => $cycle->coop->farm->species ?? 'broiler',
                'current_age' => $currentAge,
                'target_days' => $cycle->target_days,
                'live_population' => $livePop,
                'estimated_weight_kg' => $estTotalWeightKg,
                'avg_weight_kg' => round($avgWeightG / 1000, 2),
                'is_withdrawal_safe' => $withdrawalStatus['is_safe_to_harvest'],
                'safe_harvest_date' => $withdrawalStatus['safe_harvest_date'],
                'active_withdrawals' => $withdrawalStatus['active_withdrawals'],
            ];
        });

        return Inertia::render('Harvest/Listings', [
            'listings' => $listings,
            'eligibleCycles' => $eligibleCycles,
        ]);
    }

    /**
     * Store a newly created harvest listing with withdrawal certification check.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cycle_id' => 'required|exists:cycles,id',
            'available_date' => 'required|date|after_or_equal:today',
            'estimated_weight_kg' => 'required|numeric|min:1',
            'estimated_birds_count' => 'required|integer|min:1',
            'base_price_per_kg' => 'required|numeric|min:1000',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();
        $cycle = Cycle::with('coop.farm', 'healthRecords')->findOrFail($validated['cycle_id']);

        if ($cycle->coop->farm->user_id !== $user->id) {
            abort(403, 'Akses tidak sah ke kandang ini.');
        }

        // Check withdrawal safety at available_date
        $withdrawalStatus = $this->withdrawalService->getWithdrawalStatus($cycle->id, $cycle->healthRecords);
        $availableDate = Carbon::parse($validated['available_date'])->startOfDay();
        
        $isSafe = true;
        if ($withdrawalStatus['has_active']) {
            $safeDate = Carbon::parse($withdrawalStatus['safe_harvest_date'])->startOfDay();
            if ($availableDate->isBefore($safeDate)) {
                $isSafe = false;
            }
        }

        $basePrice = (float) $validated['base_price_per_kg'];
        $offtakePrice = $basePrice + 300.00; // Angonku B2B margin Rp300/kg

        $listing = HarvestListing::create([
            'cycle_id' => $cycle->id,
            'user_id' => $user->id,
            'farm_id' => $cycle->coop->farm_id,
            'available_date' => $validated['available_date'],
            'estimated_weight_kg' => $validated['estimated_weight_kg'],
            'estimated_birds_count' => $validated['estimated_birds_count'],
            'base_price_per_kg' => $basePrice,
            'offtake_price_per_kg' => $offtakePrice,
            'is_withdrawal_safe' => $isSafe,
            'status' => 'published',
            'notes' => $validated['notes'] ?? null,
        ]);

        $msg = $isSafe 
            ? 'Listing panen berhasil dipublikasikan dengan sertifikasi Bebas Residu Obat (Withdrawal Safe)!' 
            : 'Listing panen berhasil dibuat. Catatan: Tanggal panen masih dalam masa henti obat aktif.';

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Remove or cancel a harvest listing.
     */
    public function destroy($id)
    {
        $listing = HarvestListing::where('user_id', Auth::id())->findOrFail($id);

        if ($listing->status === 'sold') {
            return redirect()->back()->withErrors([
                'message' => 'Listing yang sudah terjual tidak dapat dihapus.'
            ]);
        }

        $listing->delete();

        return redirect()->back()->with('success', 'Listing panen berhasil dibatalkan.');
    }
}
