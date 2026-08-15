import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function RpaPortal({ listings = [], summary, myContracts = [], filters }) {
    const [selectedListing, setSelectedListing] = useState(null);
    const [activeTab, setActiveTab] = useState('bursa');
    const [cityFilter, setCityFilter] = useState(filters?.city || '');
    const [safeOnly, setSafeOnly] = useState(filters?.safe_only ?? true);

    const { data, setData, post, processing, reset } = useForm({
        pickup_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Pengambilan armada truk thermo RPA siap jam 04.00 WIB.',
    });

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('rpa.portal'), {
            city: cityFilter,
            safe_only: safeOnly ? 1 : 0,
        }, { preserveState: true, preserveScroll: true });
    };

    const handlePurchaseSubmit = (e) => {
        e.preventDefault();
        if (!selectedListing) return;

        post(route('rpa.purchase', { id: selectedListing.id }), {
            onSuccess: () => {
                setSelectedListing(null);
                reset();
            }
        });
    };

    const formatIndoDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <>
            <Head title="Bursa Pasokan Ayam RPA & Horeca" />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                {/* TOP HEADER */}
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '20px 20px 22px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.4)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.5l-3.5-3.5 1.41-1.41L11 13.67l5.59-5.59L18 9.5l-7 7z" fill="currentColor"/>
                                </svg>
                            </div>
                            <div>
                                <span style={{ fontSize: '11px', color: '#F0BE49', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                    B2B OFFTAKING PORTAL
                                </span>
                                <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                                    Bursa Pasokan Ayam RPA
                                </h1>
                            </div>
                        </div>

                        <span style={{ backgroundColor: '#16A34A', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                            Buyer Portal
                        </span>
                    </div>

                    {/* METRICS SUMMARY */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Total Pasokan Siap</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
                                {summary?.total_birds_ready?.toLocaleString() || 0} <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Ekor</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Total Tonase Siap</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#F0BE49' }}>
                                {summary?.total_tonnage_kg ? (summary.total_tonnage_kg / 1000).toFixed(1) : 0} <span style={{ fontSize: '12px', color: '#CBD5E1' }}>Ton</span>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Withdrawal Safe Ratio</div>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: '#4ADE80' }}>
                                {summary?.certified_safe_pct || 100}%
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', padding: '12px 14px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                            <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '4px' }}>Rata-rata Harga Offtake</div>
                            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
                                Rp {summary?.avg_offtake_price?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SELECTOR */}
                <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', padding: '0 16px' }}>
                    <button
                        onClick={() => setActiveTab('bursa')}
                        style={{
                            flex: 1,
                            padding: '12px 0',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '12.5px',
                            fontWeight: activeTab === 'bursa' ? '800' : '600',
                            color: activeTab === 'bursa' ? '#133020' : '#64748B',
                            borderBottom: activeTab === 'bursa' ? '2.5px solid #133020' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Bursa Siap Panen ({listings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('kontrak')}
                        style={{
                            flex: 1,
                            padding: '12px 0',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '12.5px',
                            fontWeight: activeTab === 'kontrak' ? '800' : '600',
                            color: activeTab === 'kontrak' ? '#133020' : '#64748B',
                            borderBottom: activeTab === 'kontrak' ? '2.5px solid #133020' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Kontrak Pengadaan ({myContracts.length})
                    </button>
                </div>

                <div className="main-scroll" style={{ padding: '16px' }}>
                    {activeTab === 'bursa' ? (
                        <>
                            {/* SEARCH & FILTER */}
                            <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Filter lokasi kota/kabupaten..."
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '9px 14px',
                                        borderRadius: '12px',
                                        border: '1.5px solid #E2E8F0',
                                        fontSize: '12px',
                                        backgroundColor: '#FFFFFF'
                                    }}
                                />

                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#166534', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                    <input
                                        type="checkbox"
                                        checked={safeOnly}
                                        onChange={(e) => setSafeOnly(e.target.checked)}
                                    />
                                    Bebas Residu
                                </label>

                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: '#16A34A',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '0 14px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        height: '36px'
                                    }}
                                >
                                    Filter
                                </button>
                            </form>

                            {/* LISTINGS FEED */}
                            {listings.length === 0 ? (
                                <div className="input-group-card" style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#94A3B8' }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                    Tidak ada pasokan ayam yang sesuai filter saat ini.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {listings.map((item) => (
                                        <div key={item.id} className="input-group-card" style={{ margin: 0, padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                        {item.is_withdrawal_safe ? (
                                                            <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontSize: '9.5px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
                                                                ✓ CERTIFIED WITHDRAWAL SAFE
                                                            </span>
                                                        ) : (
                                                            <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '9.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>
                                                                Dalam Masa Henti Obat
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                                        {item.farm?.name || 'Peternakan Ayam'} ({item.farm?.address || 'Kediri, Jawa Timur'})
                                                    </h3>
                                                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                                                        Peternak: {item.farm?.user?.name || 'Pak Budi'}
                                                    </div>
                                                </div>

                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '10px', color: '#64748B' }}>Harga RPA</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#16A34A' }}>
                                                        Rp {parseFloat(item.offtake_price_per_kg).toLocaleString('id-ID')}
                                                        <span style={{ fontSize: '10px', fontWeight: '500', color: '#64748B' }}>/kg</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SPECS GRID */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '10px', margin: '8px 0', fontSize: '11px' }}>
                                                <div>
                                                    <div style={{ color: '#94A3B8', fontSize: '10px' }}>Est. Jumlah</div>
                                                    <div style={{ fontWeight: '800', color: '#133020' }}>{item.estimated_birds_count?.toLocaleString()} ekor</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#94A3B8', fontSize: '10px' }}>Est. Tonase</div>
                                                    <div style={{ fontWeight: '800', color: '#133020' }}>{parseFloat(item.estimated_weight_kg).toLocaleString()} kg</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#94A3B8', fontSize: '10px' }}>Siap Panen</div>
                                                    <div style={{ fontWeight: '800', color: '#16A34A' }}>{formatIndoDate(item.available_date)}</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748B' }}>
                                                    {item.notes || 'Ayam sehat terawat bebas residu obat.'}
                                                </span>

                                                <button
                                                    onClick={() => setSelectedListing(item)}
                                                    style={{
                                                        backgroundColor: '#133020',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        padding: '7px 16px',
                                                        fontSize: '11.5px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 2px 6px rgba(19, 48, 32, 0.25)'
                                                    }}
                                                >
                                                    Buat Kontrak RPA &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        /* KONTRAK TAB */
                        <div>
                            {myContracts.length === 0 ? (
                                <div className="input-group-card" style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#94A3B8' }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </div>
                                    Belum ada kontrak pengadaan yang dibuat.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {myContracts.map((c) => (
                                        <div key={c.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#133020' }}>
                                                    {c.contract_number}
                                                </span>
                                                <span style={{
                                                    fontSize: '9.5px',
                                                    fontWeight: '800',
                                                    padding: '3px 8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: c.status === 'completed' ? '#ECFDF5' : '#FFFBEB',
                                                    color: c.status === 'completed' ? '#065F46' : '#92400E'
                                                }}>
                                                    {c.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
                                                {c.listing?.farm?.name || 'Peternakan Ayam'} ({c.listing?.farm?.address || '-'})
                                            </div>

                                            <div style={{ fontSize: '11px', color: '#64748B', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                                                <div>Tonase: <strong>{parseFloat(c.agreed_tonnage_kg).toLocaleString()} kg</strong></div>
                                                <div>Harga: <strong>Rp {parseFloat(c.agreed_price_per_kg).toLocaleString()}/kg</strong></div>
                                                <div>Tgl Pickup: <strong>{formatIndoDate(c.scheduled_pickup_date)}</strong></div>
                                                <div>Total: <strong style={{ color: '#16A34A' }}>Rp {parseFloat(c.total_amount).toLocaleString('id-ID')}</strong></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* MODAL BUAT KONTRAK */}
                {selectedListing && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{
                            backgroundColor: '#FFFFFF',
                            width: '100%',
                            maxWidth: '480px',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '20px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                    Buat Kontrak Pengadaan Ayam RPA
                                </h3>
                                <button onClick={() => setSelectedListing(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#718096' }}>
                                    ✕
                                </button>
                            </div>

                            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '14px', fontSize: '11.5px', border: '1px solid #E2E8F0' }}>
                                <div style={{ fontWeight: '800', color: '#133020', marginBottom: '4px' }}>
                                    {selectedListing.farm?.name} ({selectedListing.farm?.address})
                                </div>
                                <div style={{ color: '#64748B' }}>
                                    Tonase: <strong>{parseFloat(selectedListing.estimated_weight_kg).toLocaleString()} kg</strong> (~{selectedListing.estimated_birds_count?.toLocaleString()} Ekor)
                                </div>
                                <div style={{ color: '#16A34A', fontWeight: '800', marginTop: '2px' }}>
                                    Harga Pengadaan RPA: Rp {parseFloat(selectedListing.offtake_price_per_kg).toLocaleString('id-ID')}/kg
                                </div>
                            </div>

                            <form onSubmit={handlePurchaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                        Jadwal Pengambilan Armada Truk RPA
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={data.pickup_date}
                                        onChange={(e) => setData('pickup_date', e.target.value)}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                        Catatan / Instruksi Driver
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        marginTop: '6px',
                                        backgroundColor: '#16A34A',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 0',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: processing ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {processing ? 'Menyimpan Kontrak...' : 'Konfirmasi & Kunci Pasokan'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <BottomNav activeTab="rpa" />
            </div>
        </>
    );
}
