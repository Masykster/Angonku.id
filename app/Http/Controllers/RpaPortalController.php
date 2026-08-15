<?php

namespace App\Http\Controllers;

use App\Models\HarvestListing;
use App\Models\HarvestContract;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RpaPortalController extends Controller
{
    /**
     * Display feed of available certified harvest supply for RPA buyers.
     */
    public function index(Request $request)
    {
        $city = $request->query('city');
        $safeOnly = $request->boolean('safe_only', true);
        $minWeight = $request->query('min_weight');
        $maxWeight = $request->query('max_weight');

        $query = HarvestListing::with(['farm.user', 'cycle.coop'])
            ->whereIn('status', ['published', 'reserved']);

        if ($safeOnly) {
            $query->where('is_withdrawal_safe', true);
        }

        if ($city) {
            $query->whereHas('farm', function ($q) use ($city) {
                $q->where('address', 'like', "%{$city}%");
            });
        }

        if ($minWeight) {
            $query->where('estimated_weight_kg', '>=', (float) $minWeight);
        }

        if ($maxWeight) {
            $query->where('estimated_weight_kg', '<=', (float) $maxWeight);
        }

        $listings = $query->orderBy('available_date', 'asc')->get();

        // Calculate RPA market metrics
        $allPublished = HarvestListing::where('status', 'published')->get();
        $totalBirds = $allPublished->sum('estimated_birds_count');
        $totalKg = $allPublished->sum('estimated_weight_kg');
        $safeCount = $allPublished->where('is_withdrawal_safe', true)->count();
        $safeRatio = $allPublished->count() > 0 ? round(($safeCount / $allPublished->count()) * 100) : 100;
        $avgOfftakePrice = $allPublished->count() > 0 ? round($allPublished->avg('offtake_price_per_kg')) : 22800;

        // Buyer contracts
        $myContracts = HarvestContract::where('buyer_user_id', Auth::id())
            ->with(['listing.farm.user', 'listing.cycle.coop'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('RPA/Portal', [
            'listings' => $listings,
            'summary' => [
                'total_birds_ready' => $totalBirds,
                'total_tonnage_kg' => $totalKg,
                'certified_safe_pct' => $safeRatio,
                'avg_offtake_price' => $avgOfftakePrice,
                'active_contracts_count' => $myContracts->count(),
            ],
            'myContracts' => $myContracts,
            'filters' => [
                'city' => $city,
                'safe_only' => $safeOnly,
                'min_weight' => $minWeight,
                'max_weight' => $maxWeight,
            ],
        ]);
    }

    /**
     * Purchase a harvest listing by RPA buyer.
     */
    public function purchaseListing(Request $request, $id)
    {
        $validated = $request->validate([
            'pickup_date' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();
        if (!$user->isRpaBuyer()) {
            abort(403, 'Akses khusus buyer RPA / Rumah Potong Ayam.');
        }

        return DB::transaction(function () use ($id, $validated, $user) {
            $listing = HarvestListing::lockForUpdate()->findOrFail($id);

            if ($listing->status === 'sold') {
                return redirect()->back()->withErrors([
                    'message' => 'Listing panen ini sudah dibeli oleh buyer lain.'
                ]);
            }

            $totalKg = (float) $listing->estimated_weight_kg;
            $offtakePrice = (float) $listing->offtake_price_per_kg;
            $totalPrice = $totalKg * $offtakePrice;
            $platformMarginFee = $totalKg * 300.00; // Rp300 / kg platform margin

            $contract = HarvestContract::create([
                'harvest_listing_id' => $listing->id,
                'buyer_user_id' => $user->id,
                'total_kg_purchased' => $totalKg,
                'total_price' => $totalPrice,
                'platform_margin_fee' => $platformMarginFee,
                'status' => 'confirmed',
                'pickup_date' => $validated['pickup_date'],
            ]);

            $listing->update(['status' => 'sold']);

            return redirect()->back()->with('success', "Kontrak pasokan ayam #KON-{$contract->id} berhasil dibuat! Total: Rp " . number_format($totalPrice, 0, ',', '.') . " ({$totalKg} kg). Tanggal pickup: " . Carbon::parse($validated['pickup_date'])->format('d M Y') . ".");
        });
    }
}
