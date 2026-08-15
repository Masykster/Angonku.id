import { Head, Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function Index({ cycles = [] }) {
    const activeCycles = cycles.filter(c => c.status === 'active');
    const completedCycles = cycles.filter(c => c.status === 'harvested' || c.status === 'closed_forced');

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getSpeciesLabel = (species) => {
        return {
            broiler: 'Ayam Broiler',
            bebek: 'Bebek',
            lele: 'Lele',
            nila: 'Nila'
        }[species] || 'Ayam Broiler';
    };

    const formatCoopTitle = (coopCode) => {
        const raw = coopCode || 'A1';
        return raw.toLowerCase().startsWith('kandang') ? raw : `Kandang ${raw}`;
    };

    return (
        <>
            <Head title="Riwayat Siklus" />

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
                        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>Riwayat Siklus</h1>
                        <span style={{ fontSize: '11px', color: '#CBD5E1' }}>Pantau performa dan arsip peternakan</span>
                    </div>
                </div>

                <div className="main-scroll" style={{ padding: '16px' }}>
                    {/* ACTIVE CYCLES */}
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#133020', marginBottom: '12px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                            Siklus Aktif ({activeCycles.length})
                        </h2>
                        {activeCycles.length === 0 ? (
                            <div className="input-group-card" style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B', fontSize: '12.5px', margin: 0, borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                                Tidak ada siklus kandang yang sedang aktif.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {activeCycles.map((cycle) => (
                                    <div key={cycle.id} className="input-group-card" style={{ margin: 0, padding: '16px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '8px' }}>
                                                    {getSpeciesLabel(cycle.coop?.farm?.species)}
                                                </span>
                                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                                    {formatCoopTitle(cycle.coop?.coop_code)}
                                                </h3>
                                                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0' }}>
                                                    Mulai: <strong>{formatDate(cycle.doc_date)}</strong> · {cycle.doc_count.toLocaleString()} Ekor
                                                </p>
                                            </div>
                                            <Link 
                                                href={route('cycle.show', { cycle: cycle.id })}
                                                style={{
                                                    backgroundColor: '#16A34A',
                                                    color: 'white',
                                                    fontSize: '11.5px',
                                                    fontWeight: '700',
                                                    padding: '7px 14px',
                                                    borderRadius: '10px',
                                                    textDecoration: 'none',
                                                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
                                                }}
                                            >
                                                Pantau
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* COMPLETED CYCLES */}
                    <div>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#133020', marginBottom: '12px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                            Siklus Selesai ({completedCycles.length})
                        </h2>
                        {completedCycles.length === 0 ? (
                            <div className="input-group-card" style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B', fontSize: '12.5px', margin: 0, borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#94A3B8' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </div>
                                Belum ada riwayat siklus yang selesai.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {completedCycles.map((cycle) => (
                                    <div key={cycle.id} className="input-group-card" style={{ margin: 0, padding: '16px', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div>
                                                <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', display: 'inline-block', marginBottom: '6px' }}>
                                                    {getSpeciesLabel(cycle.coop?.farm?.species)}
                                                </span>
                                                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                                    {formatCoopTitle(cycle.coop?.coop_code)}
                                                </h3>
                                            </div>
                                            <span style={{ backgroundColor: '#E2E8F0', color: '#475569', fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>
                                                PANEN SELESAI
                                            </span>
                                        </div>
                                        
                                        <div style={{ fontSize: '11px', color: '#64748B', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '8px', marginTop: '8px' }}>
                                            <div>
                                                <div>Mulai</div>
                                                <div style={{ fontWeight: '700', color: '#133020' }}>{formatDate(cycle.doc_date)}</div>
                                            </div>
                                            <div>
                                                <div>Selesai</div>
                                                <div style={{ fontWeight: '700', color: '#133020' }}>{formatDate(cycle.closed_at)}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                            <Link 
                                                href={route('cycles.report', { cycle: cycle.id })}
                                                style={{
                                                    flex: 1,
                                                    textAlign: 'center',
                                                    border: '1.5px solid #16A34A',
                                                    color: '#16A34A',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    padding: '8px 0',
                                                    borderRadius: '10px',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <span>📄</span> Lihat Laporan Bankable
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <BottomNav activeTab="timeline" />
            </div>
        </>
    );
}
