<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use App\Models\Cycle;
use App\Models\Cooperative;
use App\Services\CalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KoperasiDashboardController extends Controller
{
    protected CalculationService $calculationService;

    public function __construct(CalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Display cooperative aggregate dashboard.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $cooperative = $user->cooperative;

        if (!$cooperative) {
            return redirect()->route('dashboard')->withErrors([
                'message' => 'Anda belum terhubung dengan Koperasi manapun.'
            ]);
        }

        // Get all member farmers under this cooperative
        $members = $cooperative->users()->where('role', 'peternak')->with([
            'farms.coops.cycles' => function ($q) {
                $q->where('status', 'active')->with(['dailyRecords' => function ($dr) {
                    $dr->orderBy('day_number', 'desc');
                }]);
            }
        ])->get();

        $allFarms = [];
        $totalPopulation = 0;
        $totalCoops = 0;
        $activeCyclesCount = 0;
        $fcrList = [];
        $mortalityList = [];
        $alertFarms = [];

        foreach ($members as $member) {
            foreach ($member->farms as $farm) {
                $farmActiveCycles = [];
                $farmTotalPop = 0;
                $farmFcrSum = 0;
                $farmFcrCount = 0;
                $farmMortalitySum = 0;
                $farmMortalityCount = 0;
                $farmCondition = 'optimal'; // optimal, waspada, kritis

                foreach ($farm->coops as $coop) {
                    $totalCoops++;
                    $activeCycle = $coop->cycles->first();

                    if ($activeCycle) {
                        $activeCyclesCount++;
                        $latestRecord = $activeCycle->dailyRecords->first();
                        
                        $livePop = $latestRecord ? (int) $latestRecord->live_population : (int) $activeCycle->doc_count;
                        $fcr = $latestRecord && $latestRecord->fcr_current ? (float) $latestRecord->fcr_current : null;
                        $mortalityRate = $latestRecord ? (float) $latestRecord->mortality_rate : 0.0;
                        $condition = $latestRecord ? $latestRecord->condition : 'good';

                        $totalPopulation += $livePop;
                        $farmTotalPop += $livePop;

                        if ($fcr !== null && $fcr > 0) {
                            $fcrList[] = $fcr;
                            $farmFcrSum += $fcr;
                            $farmFcrCount++;
                        }

                        $mortalityList[] = $mortalityRate;
                        $farmMortalitySum += $mortalityRate;
                        $farmMortalityCount++;

                        if ($condition === 'critical' || $mortalityRate > 5.0) {
                            $farmCondition = 'kritis';
                        } elseif ($farmCondition !== 'kritis' && ($condition === 'warning' || $mortalityRate > 2.5)) {
                            $farmCondition = 'waspada';
                        }

                        $farmActiveCycles[] = [
                            'id' => $activeCycle->id,
                            'coop_code' => $coop->coop_code,
                            'doc_date' => $activeCycle->doc_date,
                            'doc_count' => $activeCycle->doc_count,
                            'live_population' => $livePop,
                            'fcr_current' => $fcr ? round($fcr, 2) : 0,
                            'mortality_rate' => round($mortalityRate, 1),
                            'day_number' => $latestRecord ? $latestRecord->day_number : 1,
                            'target_days' => $activeCycle->target_days,
                            'condition' => $condition,
                        ];
                    }
                }

                $avgFarmFcr = $farmFcrCount > 0 ? round($farmFcrSum / $farmFcrCount, 2) : 1.45;
                $avgFarmMortality = $farmMortalityCount > 0 ? round($farmMortalitySum / $farmMortalityCount, 1) : 1.2;

                $farmItem = [
                    'id' => $farm->id,
                    'name' => $farm->name,
                    'farmer_name' => $member->name,
                    'farmer_phone' => $member->phone,
                    'address' => $farm->address,
                    'species' => $farm->species ?? 'broiler',
                    'coops_count' => $farm->coops->count(),
                    'active_cycles_count' => count($farmActiveCycles),
                    'total_population' => $farmTotalPop,
                    'avg_fcr' => $avgFarmFcr,
                    'avg_mortality' => $avgFarmMortality,
                    'status' => $farmCondition, // 'optimal', 'waspada', 'kritis'
                    'active_cycles' => $farmActiveCycles,
                ];

                $allFarms[] = $farmItem;

                if ($farmCondition === 'kritis' || $farmCondition === 'waspada') {
                    $alertFarms[] = $farmItem;
                }
            }
        }

        $avgAggregateFcr = count($fcrList) > 0 ? round(array_sum($fcrList) / count($fcrList), 2) : 1.48;
        $avgAggregateMortality = count($mortalityList) > 0 ? round(array_sum($mortalityList) / count($mortalityList), 1) : 2.1;

        return Inertia::render('Koperasi/Dashboard', [
            'cooperative' => [
                'id' => $cooperative->id,
                'name' => $cooperative->name,
                'license_status' => $cooperative->license_status,
                'subscription_expires_at' => $cooperative->subscription_expires_at ? $cooperative->subscription_expires_at->format('d M Y') : 'Aktif Permanen',
                'pic_name' => $cooperative->pic_name,
                'phone' => $cooperative->phone,
            ],
            'summary' => [
                'total_members' => $members->count(),
                'total_farms' => count($allFarms),
                'total_coops' => $totalCoops,
                'active_cycles' => $activeCyclesCount,
                'total_population' => $totalPopulation,
                'avg_fcr' => $avgAggregateFcr,
                'avg_mortality' => $avgAggregateMortality,
                'alert_farms_count' => count($alertFarms),
            ],
            'farms' => $allFarms,
            'alert_farms' => $alertFarms,
        ]);
    }

    /**
     * Display detail of a single member farm.
     */
    public function farmDetail($id)
    {
        $user = Auth::user();
        $cooperative = $user->cooperative;

        if (!$cooperative) {
            return redirect()->route('dashboard');
        }

        // Ensure farm belongs to a member of this cooperative
        $farm = Farm::whereHas('user', function ($q) use ($cooperative) {
            $q->where('cooperative_id', $cooperative->id);
        })->with([
            'user',
            'coops.cycles' => function ($q) {
                $q->orderBy('created_at', 'desc')->with([
                    'dailyRecords' => function ($dr) {
                        $dr->orderBy('day_number', 'asc');
                    },
                    'harvestRecord',
                ]);
            }
        ])->findOrFail($id);

        $cyclesData = [];
        foreach ($farm->coops as $coop) {
            foreach ($coop->cycles as $cycle) {
                $financials = $this->calculationService->calculateFinancials($cycle);
                $latestDaily = $cycle->dailyRecords->last();
                
                $cyclesData[] = [
                    'id' => $cycle->id,
                    'coop_code' => $coop->coop_code,
                    'status' => $cycle->status,
                    'doc_date' => $cycle->doc_date,
                    'doc_count' => $cycle->doc_count,
                    'target_days' => $cycle->target_days,
                    'latest_fcr' => $latestDaily && $latestDaily->fcr_current ? round((float) $latestDaily->fcr_current, 2) : ($cycle->harvestRecord ? round((float) $cycle->harvestRecord->fcr_final, 2) : 0),
                    'latest_mortality' => $latestDaily ? round((float) $latestDaily->mortality_rate, 1) : ($cycle->harvestRecord ? round((float) $cycle->harvestRecord->mortality_rate, 1) : 0),
                    'live_population' => $latestDaily ? $latestDaily->live_population : $cycle->doc_count,
                    'financials' => $financials,
                    'daily_records' => $cycle->dailyRecords->map(fn($r) => [
                        'day_number' => $r->day_number,
                        'record_date' => $r->record_date ? $r->record_date->toDateString() : '',
                        'feed_kg' => (float) $r->feed_kg,
                        'mortality' => (int) $r->mortality,
                        'avg_weight_g' => (float) $r->avg_weight_g,
                        'fcr_current' => (float) $r->fcr_current,
                        'mortality_rate' => (float) $r->mortality_rate,
                    ]),
                ];
            }
        }

        return Inertia::render('Koperasi/FarmDetail', [
            'cooperative' => $cooperative,
            'farm' => [
                'id' => $farm->id,
                'name' => $farm->name,
                'address' => $farm->address,
                'species' => $farm->species ?? 'broiler',
                'farmer_name' => $farm->user->name,
                'farmer_email' => $farm->user->email,
                'farmer_phone' => $farm->user->phone,
            ],
            'cycles' => $cyclesData,
        ]);
    }
}
