import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function Index({ latestPrices = [], recommendations = [], history = [], remainingFeedKg = 1000, lastUpdated }) {
    const [openCharts, setOpenCharts] = useState({
        CORN: true,
        SOYBEAN: false,
        RICEBRAN: false
    });

    const toggleChart = (commodity) => {
        setOpenCharts(prev => ({
            ...prev,
            [commodity]: !prev[commodity]
        }));
    };

    const getCommInfo = (comm) => {
        switch (comm) {
            case 'CORN':
                return {
                    name: 'Jagung Pipil',
                    badgeBg: '#FEF3C7',
                    badgeText: '#92400E',
                    desc: 'Sumber energi & karbohidrat utama ransum pakan ayam'
                };
            case 'SOYBEAN':
                return {
                    name: 'Bungkil Kedelai',
                    badgeBg: '#E0E7FF',
                    badgeText: '#3730A3',
                    desc: 'Sumber protein nabati dengan profil asam amino lengkap'
                };
            case 'RICEBRAN':
                return {
                    name: 'Dedak Padi Halus',
                    badgeBg: '#ECFDF5',
                    badgeText: '#065F46',
                    desc: 'Serat kasar & energi penunjang saluran pencernaan'
                };
            default:
                return {
                    name: comm,
                    badgeBg: '#F1F5F9',
                    badgeText: '#334155',
                    desc: 'Komoditas bahan baku pakan ternak'
                };
        }
    };

    const hasData = latestPrices.length > 0;

    const renderHistoryChart = (commName) => {
        const commHistory = history[commName] || [];
        if (commHistory.length === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748B', fontSize: '12px' }}>
                    Belum ada data grafik historis untuk {getCommInfo(commName).name}.
                </div>
            );
        }

        const width = 340;
        const height = 160;
        const paddingLeft = 44;
        const paddingRight = 15;
        const paddingTop = 15;
        const paddingBottom = 25;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const prices = commHistory.map(h => parseFloat(h.price_idr));
        const minPrice = Math.min(...prices) * 0.98;
        const maxPrice = Math.max(...prices) * 1.02;
        const range = maxPrice - minPrice || 1;

        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

        const getX = (index) => paddingLeft + (index / (commHistory.length - 1 || 1)) * chartWidth;
        const getY = (price) => height - paddingBottom - ((price - minPrice) / range) * chartHeight;

        const points = commHistory.map((h, idx) => ({
            x: getX(idx),
            y: getY(parseFloat(h.price_idr)),
            price: parseFloat(h.price_idr),
            date: h.recorded_date
        }));

        const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const avgY = getY(avg);
        const todayPoint = points[points.length - 1];

        const formatDateLabel = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        };

        return (
            <div style={{ marginTop: '12px', backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748B', marginBottom: '8px', fontWeight: '700' }}>
                    <span>Tren 30 Hari Terakhir</span>
                    <span>Rata-rata: Rp {Math.round(avg).toLocaleString('id-ID')}/kg</span>
                </div>

                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                    <rect 
                        x={paddingLeft} 
                        y={avgY} 
                        width={chartWidth} 
                        height={height - paddingBottom - avgY} 
                        fill="rgba(22, 163, 74, 0.08)" 
                    />
                    
                    <line 
                        x1={paddingLeft} 
                        y1={avgY} 
                        x2={width - paddingRight} 
                        y2={avgY} 
                        stroke="#16A34A" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4" 
                    />
                    <text x={paddingLeft + 4} y={avgY - 4} fontSize="8" fill="#16A34A" fontWeight="700">Zona Beli Bagus (&lt; Rata-rata)</text>

                    <path 
                        d={linePath} 
                        fill="none" 
                        stroke="#334155" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />

                    <text x={paddingLeft - 5} y={getY(minPrice) + 3} fontSize="8" fill="#94A3B8" fontWeight="600" textAnchor="end">
                        {Math.round(minPrice).toLocaleString('id-ID')}
                    </text>
                    <text x={paddingLeft - 5} y={getY(maxPrice) + 3} fontSize="8" fill="#94A3B8" fontWeight="600" textAnchor="end">
                        {Math.round(maxPrice).toLocaleString('id-ID')}
                    </text>

                    {points.length > 0 && (
                        <>
                            <text x={paddingLeft} y={height - 8} fontSize="8" fill="#94A3B8" fontWeight="600" textAnchor="start">
                                {formatDateLabel(points[0].date)}
                            </text>
                            <text x={paddingLeft + chartWidth / 2} y={height - 8} fontSize="8" fill="#94A3B8" fontWeight="600" textAnchor="middle">
                                {formatDateLabel(points[Math.floor(points.length / 2)].date)}
                            </text>
                            <text x={width - paddingRight} y={height - 8} fontSize="8" fill="#94A3B8" fontWeight="600" textAnchor="end">
                                {formatDateLabel(points[points.length - 1].date)}
                            </text>
                        </>
                    )}

                    {todayPoint && (
                        <g>
                            <circle cx={todayPoint.x} cy={todayPoint.y} r="5" fill="#16A34A" stroke="white" strokeWidth="1.5" />
                            <rect 
                                x={todayPoint.x - 32} 
                                y={todayPoint.y - 20} 
                                width="64" 
                                height="14" 
                                rx="4" 
                                fill="#133020" 
                            />
                            <text 
                                x={todayPoint.x} 
                                y={todayPoint.y - 10} 
                                fontSize="8" 
                                fill="white" 
                                fontWeight="700" 
                                textAnchor="middle"
                            >
                                Rp {Math.round(todayPoint.price).toLocaleString('id-ID')}
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <>
            <Head title="Harga Pasar Komoditas Pakan" />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                {/* HEADER */}
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
                    <Link href="/dashboard" className="back-btn-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', width: '34px', height: '34px', borderRadius: '50%' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>Harga Komoditas Pakan</h1>
                        {lastUpdated && (
                            <span style={{ fontSize: '11px', color: '#CBD5E1' }}>Diperbarui: {lastUpdated} WIB</span>
                        )}
                    </div>
                </div>

                {/* MAIN SCROLL */}
                <div className="main-scroll" style={{ padding: '16px' }}>
                    {!hasData ? (
                        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#94A3B8' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: '0 0 6px' }}>Data Pasar Sedang Dimuat</h2>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px', lineHeight: 1.4 }}>
                                Sistem sedang menyinkronkan data komoditas pasar terbaru.
                            </p>
                            <Link href="/dashboard" style={{
                                display: 'inline-block', backgroundColor: '#16A34A', color: 'white', fontWeight: '700', fontSize: '12px',
                                padding: '9px 20px', borderRadius: '12px', textDecoration: 'none'
                            }}>
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* REKOMENDASI BELI GROSIR BANNER */}
                            {recommendations.recommendations && recommendations.recommendations.length > 0 && (
                                <div style={{
                                    backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '18px', padding: '16px',
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                            ✓
                                        </div>
                                        <h3 style={{ fontSize: '13.5px', fontWeight: '800', color: '#065F46', margin: 0 }}>Rekomendasi Beli Grosir</h3>
                                    </div>
                                    <p style={{ fontSize: '11.5px', color: '#064E3B', margin: '0 0 12px', lineHeight: 1.45 }}>
                                        Harga komoditas pakan berikut sedang turun signifikan dibanding rata-rata 30 hari. Disarankan melakukan pembelian stok untuk sisa kebutuhan siklus.
                                    </p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {recommendations.recommendations.map((rec, idx) => {
                                            const info = getCommInfo(rec.commodity);
                                            return (
                                                <div key={idx} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '10px 12px', border: '1px solid #C8E6C9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#133020' }}>
                                                            {info.name}
                                                        </span>
                                                        <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                                                            Hemat Rp {Math.round(rec.savings_per_kg).toLocaleString('id-ID')}/kg
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#047857', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '6px' }}>
                                                            Hemat Rp {Math.round(rec.total_savings).toLocaleString('id-ID')}
                                                        </span>
                                                        <div style={{ fontSize: '9.5px', color: '#64748B', marginTop: '2px' }}>
                                                            Est. Kebutuhan: {Math.round(remainingFeedKg)} kg
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* COMMODITY CARDS */}
                            {latestPrices.map((comm) => {
                                const info = getCommInfo(comm.commodity);
                                const isChartOpen = openCharts[comm.commodity];
                                
                                const recommendation = recommendations.recommendations?.find(r => r.commodity === comm.commodity);
                                const noRec = recommendations.no_recommendations?.find(r => r.commodity === comm.commodity);
                                
                                const changePct = recommendation ? -recommendation.drop_pct : (noRec ? noRec.change_pct : parseFloat(comm.change_pct_30d) || 0);
                                const isDown = changePct < 0;
                                const avg30d = recommendation ? recommendation.avg_30d : (noRec ? noRec.avg_30d : parseFloat(comm.price_idr));

                                return (
                                    <div key={comm.id} className="input-group-card" style={{ margin: 0, padding: '16px 18px', borderRadius: '18px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ backgroundColor: info.badgeBg, color: info.badgeText, fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                                        {comm.commodity}
                                                    </span>
                                                    <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: 0 }}>{info.name}</h2>
                                                </div>
                                                <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.35 }}>{info.desc}</p>
                                            </div>
                                            
                                            <span style={{
                                                fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px',
                                                backgroundColor: isDown ? '#ECFDF5' : '#FFF1F2',
                                                color: isDown ? '#047857' : '#E11D48',
                                                border: isDown ? '1px solid #A7F3D0' : '1px solid #FECDD3'
                                            }}>
                                                {isDown ? '↓' : '↑'} {Math.abs(changePct).toFixed(1)}%
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                                            <div>
                                                <div style={{ fontSize: '9.5px', fontWeight: '700', color: '#64748B' }}>HARGA HARI INI</div>
                                                <div style={{ fontSize: '20px', fontWeight: '800', color: '#133020', marginTop: '2px' }}>
                                                    Rp {Math.round(comm.price_idr).toLocaleString('id-ID')}<span style={{ fontSize: '11px', fontWeight: '600', color: '#64748B' }}>/kg</span>
                                                </div>
                                            </div>
                                            
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '9.5px', fontWeight: '700', color: '#64748B' }}>RATA-RATA 30 HARI</div>
                                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginTop: '4px' }}>
                                                    Rp {Math.round(avg30d).toLocaleString('id-ID')}/kg
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accordion toggle button */}
                                        <button 
                                            onClick={() => toggleChart(comm.commodity)}
                                            style={{
                                                display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '6px',
                                                marginTop: '10px', padding: '8px 0 0', backgroundColor: 'transparent', border: 'none',
                                                borderTop: '1px solid #F1F5F9', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                                                color: '#16A34A'
                                            }}
                                        >
                                            {isChartOpen ? 'Sembunyikan Grafik 30 Hari' : 'Lihat Grafik 30 Hari'}
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isChartOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>

                                        {/* Chart panel */}
                                        {isChartOpen && renderHistoryChart(comm.commodity)}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <BottomNav activeTab="home" />
            </div>
        </>
    );
}
