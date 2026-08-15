<?php

namespace App\Services;

use App\Models\Cycle;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\CalculationService;

class PdfReportService
{
    protected $calculationService;

    public function __construct(CalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Generate PDF for a cycle report and return download stream.
     */
    public function generate(Cycle $cycle)
    {
        $cycle->load(['coop.farm.user', 'dailyRecords' => function ($q) {
            $q->orderBy('record_date', 'asc');
        }, 'healthRecords' => function ($q) {
            $q->orderBy('record_date', 'asc');
        }, 'harvestRecord']);

        $totalFeedKg = (float) $cycle->dailyRecords->sum('feed_kg');
        $financials = $this->calculationService->calculateFinancials($cycle);

        $pdf = Pdf::loadView('pdf.cycle-report', [
            'cycle' => $cycle,
            'total_feed_kg' => $totalFeedKg,
            'financials' => $financials,
        ]);

        $safeCoopCode = str_replace(' ', '_', $cycle->coop->coop_code);
        $fileName = 'Laporan_' . $safeCoopCode . '_' . now()->format('Y-m-d') . '.pdf';

        return $pdf->download($fileName);
    }
}
