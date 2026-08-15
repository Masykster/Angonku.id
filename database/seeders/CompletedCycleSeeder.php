<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Farm;
use App\Models\Coop;
use App\Models\Cycle;
use App\Models\DailyRecord;
use App\Models\HealthRecord;
use App\Models\HarvestRecord;
use App\Services\GoldenTimelineService;
use Carbon\Carbon;

class CompletedCycleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get user
        $user = User::where('email', 'test@example.com')->first() ?: User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
        }

        // 2. Get or create Farm
        $farm = $user->farms()->first();
        if (!$farm) {
            $farm = Farm::create([
                'user_id' => $user->id,
                'name' => 'Pibo Farm Kediri',
                'address' => 'Jl. Raya Papar No. 45, Kediri, Jawa Timur',
                'latitude' => -7.7124,
                'longitude' => 112.0734,
                'species' => 'broiler',
                'is_active' => true,
            ]);
        }

        // 3. Get or create Coop
        $coop = $farm->coops()->first();
        if (!$coop) {
            $coop = Coop::create([
                'farm_id' => $farm->id,
                'coop_code' => 'Kandang A1',
                'coop_type' => 'close_house',
                'capacity' => 6000,
                'area_m2' => 300,
                'is_active' => true,
            ]);
        }

        // 4. Create completed cycle
        // Run from 45 days ago to 10 days ago (35 days duration)
        $docDate = Carbon::today()->subDays(45);
        $harvestDate = Carbon::today()->subDays(10);
        $docCount = 6000;

        // Ensure we don't duplicate the completed cycle if run multiple times
        $existingCompleted = Cycle::where('coop_id', $coop->id)
            ->where('status', 'harvested')
            ->first();

        if ($existingCompleted) {
            $existingCompleted->dailyRecords()->delete();
            $existingCompleted->healthRecords()->delete();
            if ($existingCompleted->harvestRecord) {
                $existingCompleted->harvestRecord->delete();
            }
            $existingCompleted->timelineTasks()->delete();
            $existingCompleted->delete();
        }

        $cycle = Cycle::create([
            'coop_id' => $coop->id,
            'doc_date' => $docDate->toDateString(),
            'doc_count' => $docCount,
            'strain' => 'Cobb',
            'supplier_doc' => 'Kemitraan Utama',
            'price_doc' => 7200,
            'target_days' => 35,
            'status' => 'harvested',
            'notes' => 'Siklus panen raya perdana dengan bobot optimal dan FCR sangat efisien.',
            'closed_at' => $harvestDate,
        ]);

        // Seed golden timeline tasks
        GoldenTimelineService::seedForCycle($cycle);

        // Mark all timeline tasks for this cycle as done since it is completed
        $cycle->timelineTasks()->update(['is_done' => true]);

        // Seed 35 daily records
        $cumFeed = 0;
        $cumMortality = 0;
        for ($day = 1; $day <= 35; $day++) {
            $recordDate = (clone $docDate)->addDays($day - 1);
            
            // Random daily feed consumption (increases as chickens grow)
            $feedKg = 100 + ($day * 15) + rand(-10, 10);
            $cumFeed += $feedKg;

            // Random mortality (low rate)
            $mortality = 0;
            if ($day % 5 === 0 && rand(0, 1)) {
                $mortality = rand(1, 3);
            }
            $cumMortality += $mortality;

            $livePop = $docCount - $cumMortality;

            // Daily average weight in grams
            $avgWeightG = 40 + ($day * 53) + rand(-20, 20);

            // Calculate daily FCR
            $fcrCurrent = $avgWeightG > 0 ? $cumFeed / (($livePop * $avgWeightG) / 1000) : 0;
            $mortalityRate = ($cumMortality / $docCount) * 100;

            DailyRecord::create([
                'cycle_id' => $cycle->id,
                'record_date' => $recordDate->toDateString(),
                'day_number' => $day,
                'feed_kg' => $feedKg,
                'mortality' => $mortality,
                'avg_weight_g' => $avgWeightG,
                'live_population' => $livePop,
                'cum_feed_kg' => $cumFeed,
                'cum_mortality' => $cumMortality,
                'fcr_current' => $fcrCurrent,
                'mortality_rate' => $mortalityRate,
                'condition' => 'good',
            ]);
        }

        // Add 3 health records (vaccines/antibiotics)
        // ND Vaccine on Day 4
        HealthRecord::create([
            'cycle_id' => $cycle->id,
            'record_date' => (clone $docDate)->addDays(3)->toDateString(),
            'record_type' => 'vaccination',
            'drug_name' => 'Vaksin ND (Newcastle)',
            'dosage' => '1 vial / 1000 ekor',
            'method' => 'drinking_water',
            'withdrawal_days' => 0,
            'withdrawal_end' => (clone $docDate)->addDays(3)->toDateString(),
            'notes' => 'Vaksinasi rutin hari ke-4 mencegah tetelo.',
        ]);

        // Antibiotic Enrofloksasin on Day 15 with 10 days withdrawal
        HealthRecord::create([
            'cycle_id' => $cycle->id,
            'record_date' => (clone $docDate)->addDays(14)->toDateString(),
            'record_type' => 'treatment',
            'drug_name' => 'Enrofloksasin',
            'dosage' => '0.5 ml / liter air',
            'method' => 'drinking_water',
            'withdrawal_days' => 10,
            'withdrawal_end' => (clone $docDate)->addDays(24)->toDateString(),
            'notes' => 'Pencegahan gangguan pernapasan/CRD.',
        ]);

        // Vitamin C on Day 28
        HealthRecord::create([
            'cycle_id' => $cycle->id,
            'record_date' => (clone $docDate)->addDays(27)->toDateString(),
            'record_type' => 'treatment',
            'drug_name' => 'Vitamin C',
            'dosage' => '1 gram / 2 liter air',
            'method' => 'drinking_water',
            'withdrawal_days' => 0,
            'withdrawal_end' => (clone $docDate)->addDays(27)->toDateString(),
            'notes' => 'Anti-stres karena suhu panas.',
        ]);

        // 5. Create harvest record
        $harvestCount = $docCount - $cumMortality;
        $avgWeightKg = 1.89; // 1.89 kg avg weight
        $totalWeightKg = $harvestCount * $avgWeightKg;
        $pricePerKg = 22500; // Rp 22.500 / kg
        $totalRevenue = $totalWeightKg * $pricePerKg;
        $fcrFinal = $cumFeed / $totalWeightKg;
        $mortalityRate = ($cumMortality / $docCount) * 100;
        $survivalRate = 100 - $mortalityRate;

        // ipScore = ((survivalRate/100) * avgWeightKg) / (fcrFinal * harvestAgeDays) * 100
        $ipScore = (($survivalRate / 100) * $avgWeightKg) / ($fcrFinal * 35) * 100;

        HarvestRecord::create([
            'cycle_id' => $cycle->id,
            'harvest_date' => $harvestDate->toDateString(),
            'harvest_count' => $harvestCount,
            'total_weight_kg' => $totalWeightKg,
            'avg_weight_kg' => $avgWeightKg,
            'price_per_kg' => $pricePerKg,
            'total_revenue' => $totalRevenue,
            'fcr_final' => $fcrFinal,
            'ip_score' => $ipScore,
            'mortality_rate' => $mortalityRate,
            'notes' => 'Siklus panen raya perdana dengan bobot optimal dan FCR sangat efisien.',
        ]);
    }
}
