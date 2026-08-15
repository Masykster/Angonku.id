import { Head, Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function FarmDetail({ cooperative, farm, cycles = [] }) {
    return (
        <>
            <Head title={`Detail Kandang - ${farm.name}`} />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                {/* HEADER */}
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link 
                        href={route('koperasi.dashboard')} 
                        className="back-btn-circle" 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', textDecoration: 'none', color: 'white' }}
                    >
                        &larr;
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>{farm.name}</h1>
                        <span style={{ fontSize: '11px', color: '#F0BE49' }}>Peternak: {farm.farmer_name} · {farm.farmer_phone || '-'}</span>
                    </div>
                </div>

                <div className="main-scroll" style={{ padding: '16px' }}>
                    {/* FARM INFO CARD */}
                    <div className="input-group-card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#133020', marginBottom: '8px' }}>INFORMASI PETERNAK BINAAN</div>
                        <div style={{ fontSize: '12px', color: '#4A5568', lineHeight: '1.6' }}>
                            <div>📍 <strong>Alamat:</strong> {farm.address || '-'}</div>
                            <div>🐔 <strong>Komoditas:</strong> <span style={{ textTransform: 'capitalize' }}>{farm.species}</span></div>
                            <div>✉️ <strong>Email:</strong> {farm.farmer_email}</div>
                        </div>
                    </div>

                    {/* CYCLES HISTORY */}
                    <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#133020', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Histori Siklus ({cycles.length})
                    </h2>

                    {cycles.length === 0 ? (
                        <div className="input-group-card" style={{ padding: '24px 16px', textAlign: 'center', color: '#718096' }}>
                            Belum ada histori siklus pada kandang ini.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {cycles.map((cycle) => (
                                <div key={cycle.id} className="input-group-card" style={{ padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <span style={{ 
                                                backgroundColor: cycle.status === 'active' ? '#E6FFFA' : '#EDF2F7', 
                                                color: cycle.status === 'active' ? '#234E52' : '#4A5568', 
                                                fontSize: '10px', 
                                                fontWeight: '800', 
                                                padding: '3px 8px', 
                                                borderRadius: '6px', 
                                                display: 'inline-block',
                                                marginBottom: '4px' 
                                            }}>
                                                {cycle.status === 'active' ? '🟢 SIKLUS AKTIF' : '📦 PANEN SELESAI'}
                                            </span>
                                            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                                Kandang {cycle.coop_code}
                                            </h3>
                                            <div style={{ fontSize: '11px', color: '#718096', marginTop: '2px' }}>
                                                Mulai DOC: {cycle.doc_date} ({cycle.doc_count.toLocaleString()} Ekor)
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '10px', color: '#A0AEC0' }}>FCR Terkini</div>
                                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#38A169' }}>
                                                {cycle.latest_fcr}
                                            </div>
                                        </div>
                                    </div>

                                    {/* KEY METRICS */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '12px', marginBottom: '12px', fontSize: '11px' }}>
                                        <div>
                                            <div style={{ color: '#64748B' }}>Populasi Hidup</div>
                                            <div style={{ fontWeight: '700', color: '#0F172A' }}>{cycle.live_population.toLocaleString()} ekor</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#64748B' }}>Mortalitas</div>
                                            <div style={{ fontWeight: '700', color: cycle.latest_mortality > 3 ? '#D1603D' : '#0F172A' }}>{cycle.latest_mortality}%</div>
                                        </div>
                                        <div>
                                            <div style={{ color: '#64748B' }}>Est. ROI</div>
                                            <div style={{ fontWeight: '700', color: cycle.financials?.roi >= 0 ? '#16A34A' : '#DC2626' }}>
                                                {cycle.financials?.roi ? `${cycle.financials.roi.toFixed(1)}%` : '-'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* FINANCIAL SUMMARY */}
                                    {cycle.financials && (
                                        <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '10px', fontSize: '11px', color: '#475569' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>Estimasi HPP/kg:</span>
                                                <strong style={{ color: '#1E293B' }}>Rp {Math.round(cycle.financials.hpp_kg).toLocaleString('id-ID')}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>Total Biaya Operasional & Pakan:</span>
                                                <strong style={{ color: '#1E293B' }}>Rp {Math.round(cycle.financials.total_pengeluaran).toLocaleString('id-ID')}</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Estimasi Profit:</span>
                                                <strong style={{ color: cycle.financials.keuntungan >= 0 ? '#16A34A' : '#DC2626' }}>
                                                    Rp {Math.round(cycle.financials.keuntungan).toLocaleString('id-ID')}
                                                </strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <BottomNav activeTab="koperasi" />
            </div>
        </>
    );
}
