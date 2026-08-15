import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function KoperasiDashboard({ cooperative, summary, farms = [], alert_farms = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredFarms = farms.filter((farm) => {
        const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farm.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (farm.address && farm.address.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || farm.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head title={`Dashboard Koperasi - ${cooperative.name}`} />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                {/* TOP HEADER */}
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '20px 20px 24px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                                </svg>
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', color: '#F0BE49', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                    Enterprise B2B SaaS
                                </span>
                                <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    {cooperative.name}
                                </h1>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                                backgroundColor: cooperative.license_status === 'active' ? '#16A34A' : '#D1603D', 
                                color: 'white', 
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                fontSize: '11px', 
                                fontWeight: '700',
                                display: 'inline-block'
                            }}>
                                ● {cooperative.license_status === 'active' ? 'Lisensi Aktif' : 'Lisensi Berakhir'}
                            </span>
                            <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '4px' }}>
                                s.d {cooperative.subscription_expires_at}
                            </div>
                        </div>
                    </div>

                    {/* METRICS GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px' }}>
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Total Kandang Binaan</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
                                {summary.total_farms} <span style={{ fontSize: '12px', fontWeight: '500', color: '#CBD5E1' }}>Farm ({summary.total_coops} Kandang)</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Populasi Aktif Wilayah</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#F0BE49' }}>
                                {summary.total_population.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: '500', color: '#CBD5E1' }}>Ekor</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Rata-rata FCR Agregat</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#4ADE80' }}>
                                {summary.avg_fcr}
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Rata-rata Mortalitas</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: summary.avg_mortality > 3.0 ? '#F87171' : '#4ADE80' }}>
                                {summary.avg_mortality}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-scroll" style={{ padding: '16px' }}>
                    {/* ALERT SECTION */}
                    {alert_farms.length > 0 && (
                        <div style={{ marginBottom: '20px', backgroundColor: '#FFF5F5', border: '1.5px solid #FEB2B2', borderRadius: '16px', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#E53E3E', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                                    !
                                </div>
                                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#C53030', margin: 0 }}>
                                    {alert_farms.length} Kandang Memerlukan Perhatian (Alert Mortalitas/FCR)
                                </h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {alert_farms.map((af) => (
                                    <Link 
                                        key={af.id} 
                                        href={route('koperasi.farm-detail', { id: af.id })}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #FED7D7' }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#2D3748' }}>{af.name} ({af.farmer_name})</div>
                                            <div style={{ fontSize: '11px', color: '#E53E3E' }}>Mortalitas: {af.avg_mortality}% · FCR: {af.avg_fcr}</div>
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#C53030' }}>Periksa &rarr;</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SEARCH & FILTER */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input 
                                type="text"
                                placeholder="Cari peternak, kandang, atau lokasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '9px 14px 9px 34px',
                                    borderRadius: '12px',
                                    border: '1.5px solid #E2E8F0',
                                    fontSize: '12.5px',
                                    backgroundColor: '#FFFFFF'
                                }}
                            />
                            <div style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '9px 12px',
                                borderRadius: '12px',
                                border: '1.5px solid #E2E8F0',
                                fontSize: '12px',
                                fontWeight: '700',
                                backgroundColor: '#FFFFFF',
                                color: '#334155'
                            }}
                        >
                            <option value="all">Semua Status</option>
                            <option value="optimal">Optimal</option>
                            <option value="waspada">Waspada</option>
                            <option value="kritis">Kritis</option>
                        </select>
                    </div>

                    {/* FARMS LIST */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#133020', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Daftar Peternak Binaan ({filteredFarms.length})
                        </h2>
                    </div>

                    {filteredFarms.length === 0 ? (
                        <div className="input-group-card" style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#94A3B8' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            Tidak ada kandang yang sesuai dengan filter pencarian.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredFarms.map((farm) => {
                                const statusColor = {
                                    optimal: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'Optimal' },
                                    waspada: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'Waspada' },
                                    kritis: { bg: '#FFF1F2', text: '#9F1239', border: '#FECDD3', label: 'Kritis' },
                                }[farm.status] || { bg: '#F1F5F9', text: '#334155', border: '#E2E8F0', label: 'Normal' };

                                return (
                                    <div key={farm.id} className="input-group-card" style={{ margin: 0, padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                                        {farm.name}
                                                    </h3>
                                                    <span style={{ 
                                                        backgroundColor: statusColor.bg, 
                                                        color: statusColor.text, 
                                                        border: `1px solid ${statusColor.border}`, 
                                                        padding: '2px 8px', 
                                                        borderRadius: '6px', 
                                                        fontSize: '10px', 
                                                        fontWeight: '800',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {statusColor.label}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                                                    {farm.farmer_name} · {farm.farmer_phone || '-'}
                                                </div>
                                            </div>

                                            <Link 
                                                href={route('koperasi.farm-detail', { id: farm.id })}
                                                style={{
                                                    backgroundColor: '#16A34A',
                                                    color: 'white',
                                                    fontSize: '11.5px',
                                                    fontWeight: '700',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Rincian &rarr;
                                            </Link>
                                        </div>

                                        <div style={{ fontSize: '11px', color: '#475569', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '6px' }}>
                                            <div>
                                                <div style={{ color: '#94A3B8', fontSize: '10px' }}>Populasi</div>
                                                <div style={{ fontWeight: '800', color: '#133020', fontSize: '13px' }}>{farm.total_population.toLocaleString()} ekor</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#94A3B8', fontSize: '10px' }}>Rata-rata FCR</div>
                                                <div style={{ fontWeight: '800', color: '#16A34A', fontSize: '13px' }}>{farm.avg_fcr}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#94A3B8', fontSize: '10px' }}>Mortalitas</div>
                                                <div style={{ fontWeight: '800', color: farm.avg_mortality > 3 ? '#E11D48' : '#16A34A', fontSize: '13px' }}>{farm.avg_mortality}%</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <BottomNav activeTab="koperasi" />
            </div>
        </>
    );
}
