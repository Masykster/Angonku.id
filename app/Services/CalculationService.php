<?php

namespace App\Services;

class CalculationService
{
    /**
     * Calculate daily stats for poultry record.
     */
    public function calculateDaily(array $input, array $prev, int $initialDoc): array
    {
        $feedKg = (float) ($input['feed_kg'] ?? 0);
        $mortality = (int) ($input['mortality'] ?? 0);
        $avgWeightG = !empty($input['avg_weight_g']) ? (float) $input['avg_weight_g'] : null;

        $prevLivePop = (int) ($prev['live_population'] ?? 0);
        $prevCumFeed = (float) ($prev['cum_feed_kg'] ?? 0.0);
        $prevCumMortality = (int) ($prev['cum_mortality'] ?? 0);

        // Calculate values
        $livePop = max(0, $prevLivePop - $mortality);
        $cumFeed = $prevCumFeed + $feedKg;
        $cumMortality = $prevCumMortality + $mortality;

        // Calculate mortality rate (cumulative mortality divided by initial doc size)
        $mortalityRate = $initialDoc > 0 ? ($cumMortality / $initialDoc) * 100 : 0.00;

        // Calculate FCR
        $fcrCurrent = null;
        if ($avgWeightG && $avgWeightG > 0 && $livePop > 0) {
            $fcrCurrent = $cumFeed / (($livePop * $avgWeightG) / 1000);
        }

        // Determine general status condition
        $condition = 'good';
        $fcrVal = $fcrCurrent;
        $mrVal = $mortalityRate;

        if (($fcrVal !== null && $fcrVal > 1.9) || $mrVal > 7) {
            $condition = 'critical';
        } elseif (($fcrVal !== null && $fcrVal > 1.6) || $mrVal > 3) {
            $condition = 'warning';
        }

        return [
            'live_population' => $livePop,
            'cum_feed_kg' => $cumFeed,
            'cum_mortality' => $cumMortality,
            'fcr_current' => $fcrCurrent,
            'mortality_rate' => $mortalityRate,
            'condition' => $condition,
        ];
    }

    /**
     * Calculate final stats for harvesting.
     */
    public function calculateHarvest(array $cycle, array $harvest, array $summary): array
    {
        $docDate = \Carbon\Carbon::parse($cycle['doc_date']);
        $harvestDate = \Carbon\Carbon::parse($harvest['harvest_date']);
        $harvestAgeDays = abs($harvestDate->diffInDays($docDate));
        if ($harvestAgeDays <= 0) {
            $harvestAgeDays = 1;
        }

        $totalWeightKg = (float) $harvest['total_weight_kg'];
        $harvestCount = (int) $harvest['harvest_count'];
        $pricePerKg = isset($harvest['price_per_kg']) ? (float) $harvest['price_per_kg'] : null;

        $docCount = (int) $cycle['doc_count'];
        $sumFeedKg = (float) $summary['sum_feed_kg'];
        $sumMortality = (int) $summary['sum_mortality'];

        $avgWeightKg = $harvestCount > 0 ? $totalWeightKg / $harvestCount : 0.0;
        $fcrFinal = $totalWeightKg > 0 ? $sumFeedKg / $totalWeightKg : 0.0;
        $mortalityRate = $docCount > 0 ? ($sumMortality / $docCount) * 100 : 0.0;
        $survivalRate = 100 - $mortalityRate;

        // ipScore = ((survivalRate/100) * avgWeightKg) / (fcrFinal * harvestAgeDays) * 100
        $ipScore = 0.0;
        $divider = $fcrFinal * $harvestAgeDays;
        if ($divider > 0) {
            $ipScore = (($survivalRate / 100) * $avgWeightKg) / $divider * 100;
        }

        $totalRevenue = $pricePerKg !== null ? $totalWeightKg * $pricePerKg : null;

        return [
            'harvest_age_days' => $harvestAgeDays,
            'avg_weight_kg' => $avgWeightKg,
            'fcr_final' => $fcrFinal,
            'mortality_rate' => $mortalityRate,
            'survival_rate' => $survivalRate,
            'ip_score' => $ipScore,
            'total_revenue' => $totalRevenue,
        ];
    }

    /**
     * Calculate financial report for a cycle.
     */
    public function calculateFinancials($cycle): array
    {
        // ⚡ Bolt Optimization: Avoid lazy loading all DailyRecord models into memory if relation is not loaded.
        // If dailyRecords relation is already eager-loaded, use the in-memory collection.
        // Otherwise, perform direct DB aggregate queries (SUM and latest record) to reduce memory overhead and speed up execution.
        $hasLoadedRelation = method_exists($cycle, 'relationLoaded') && $cycle->relationLoaded('dailyRecords');

        if ($hasLoadedRelation) {
            $totalFeedKg = (float) ($cycle->dailyRecords ? $cycle->dailyRecords->sum('feed_kg') : 0);
            $lastDaily = $cycle->dailyRecords ? $cycle->dailyRecords->last() : null;
        } elseif (method_exists($cycle, 'dailyRecords')) {
            $totalFeedKg = (float) $cycle->dailyRecords()->sum('feed_kg');
            $lastDaily = $cycle->dailyRecords()->latest('record_date')->first();
        } else {
            $totalFeedKg = (float) ($cycle->dailyRecords ? $cycle->dailyRecords->sum('feed_kg') : 0);
            $lastDaily = $cycle->dailyRecords ? $cycle->dailyRecords->last() : null;
        }

        $docCount = (int) $cycle->doc_count;
        $priceDoc = $cycle->price_doc > 0 ? (float) $cycle->price_doc : 7000;

        // Constants
        $feedPricePerKg = 8500;
        $medCostPerDoc = 1500;
        $opCostPerDoc = 1000;
        $fallbackSellPricePerKg = 21000;

        // Expenses
        $biayaDoc = $docCount * $priceDoc;
        $biayaPakan = $totalFeedKg * $feedPricePerKg;
        $biayaObat = $docCount * $medCostPerDoc;
        $biayaOperasional = $docCount * $opCostPerDoc;
        $totalPengeluaran = $biayaDoc + $biayaPakan + $biayaObat + $biayaOperasional;

        // Revenue & metrics
        $isHarvested = ($cycle->status === 'harvested' || $cycle->harvestRecord !== null);
        $pemasukan = 0.0;
        $totalWeightKg = 0.0;
        $harvestCount = 0;
        $pricePerKg = 0.0;
        $isEstimatedRevenue = false;

        if ($isHarvested && $cycle->harvestRecord) {
            $totalWeightKg = (float) $cycle->harvestRecord->total_weight_kg;
            $harvestCount = (int) $cycle->harvestRecord->harvest_count;
            $pricePerKg = $cycle->harvestRecord->price_per_kg ? (float) $cycle->harvestRecord->price_per_kg : $fallbackSellPricePerKg;
            if (!$cycle->harvestRecord->price_per_kg) {
                $isEstimatedRevenue = true;
            }
            $pemasukan = $cycle->harvestRecord->total_revenue ? (float) $cycle->harvestRecord->total_revenue : ($totalWeightKg * $pricePerKg);
        } else {
            $isEstimatedRevenue = true;
            $livePopulation = $lastDaily ? (int) $lastDaily->live_population : $docCount;
            $avgWeightG = ($lastDaily && $lastDaily->avg_weight_g > 0) ? (float) $lastDaily->avg_weight_g : 1500; // default 1.5kg
            $totalWeightKg = $livePopulation * ($avgWeightG / 1000);
            $harvestCount = $livePopulation;
            $pricePerKg = $fallbackSellPricePerKg;
            $pemasukan = $totalWeightKg * $pricePerKg;
        }

        $keuntungan = $pemasukan - $totalPengeluaran;
        $hppKg = $totalWeightKg > 0 ? $totalPengeluaran / $totalWeightKg : 0;
        $hppEkor = $harvestCount > 0 ? $totalPengeluaran / $harvestCount : 0;
        $roi = $totalPengeluaran > 0 ? ($keuntungan / $totalPengeluaran) * 100 : 0;

        return [
            'biaya_doc' => $biayaDoc,
            'biaya_pakan' => $biayaPakan,
            'biaya_obat' => $biayaObat,
            'biaya_operasional' => $biayaOperasional,
            'total_pengeluaran' => $totalPengeluaran,
            'pemasukan' => $pemasukan,
            'keuntungan' => $keuntungan,
            'hpp_kg' => $hppKg,
            'hpp_ekor' => $hppEkor,
            'roi' => $roi,
            'is_estimated' => $isEstimatedRevenue,
            'price_per_kg' => $pricePerKg,
            'feed_price_per_kg' => $feedPricePerKg,
            'med_cost_per_doc' => $medCostPerDoc,
            'op_cost_per_doc' => $opCostPerDoc,
        ];
    }
}

