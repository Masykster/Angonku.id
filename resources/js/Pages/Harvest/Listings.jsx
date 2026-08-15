import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';
import HarvestListingCard from '@/Components/HarvestListingCard';

export default function HarvestListings({ listings = [], eligibleCycles = [] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCycleId, setSelectedCycleId] = useState(eligibleCycles[0]?.id || '');

    const selectedCycle = eligibleCycles.find((c) => c.id === parseInt(selectedCycleId)) || eligibleCycles[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        cycle_id: selectedCycle?.id || '',
        available_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_weight_kg: selectedCycle?.estimated_weight_kg || 5000,
        estimated_birds_count: selectedCycle?.live_population || 2800,
        base_price_per_kg: 21500,
        notes: 'Ayam sehat terawat, seragam, pakan berkualitas.',
    });

    const handleCycleChange = (id) => {
        setSelectedCycleId(id);
        const cyc = eligibleCycles.find((c) => c.id === parseInt(id));
        if (cyc) {
            setData({
                ...data,
                cycle_id: cyc.id,
                estimated_weight_kg: cyc.estimated_weight_kg,
                estimated_birds_count: cyc.live_population,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('harvest.listings.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    const offtakePrice = (parseFloat(data.base_price_per_kg) || 0) + 300;

    return (
        <>
            <Head title="Bursa Panen & Offtaking RPA" />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                {/* HEADER */}
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '22px 20px 20px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                            <span style={{ fontSize: '11px', color: '#F0BE49', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                B2B HARVEST OFFTAKING
                            </span>
                            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0', color: '#FFFFFF' }}>
                                Bursa Panen Ayam Mandiri
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            disabled={eligibleCycles.length === 0}
                            style={{
                                backgroundColor: '#16A34A',
                                color: 'white',
                                border: 'none',
                                padding: '9px 16px',
                                borderRadius: '12px',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: eligibleCycles.length === 0 ? 'not-allowed' : 'pointer',
                                opacity: eligibleCycles.length === 0 ? 0.6 : 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span>
                            <span>Pasang Iklan</span>
                        </button>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#CBD5E1', lineHeight: '1.45' }}>
                        Jual panen langsung ke Rumah Potong Ayam (RPA) & Horeca dengan jaminan harga pasti dan sertifikasi <strong>Bebas Residu Obat</strong>.
                    </div>
                </div>

                <div className="main-scroll" style={{ padding: '16px' }}>
                    {/* BANNER EDUKASI KEUNTUNGAN */}
                    <div 
                        style={{ 
                            backgroundColor: '#ECFDF5', 
                            border: '1.5px solid #A7F3D0', 
                            borderRadius: '16px', 
                            padding: '12px 14px', 
                            marginBottom: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                        }}
                    >
                        <div 
                            style={{ 
                                width: '38px', 
                                height: '38px', 
                                borderRadius: '12px', 
                                backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                                border: '1px solid #6EE7B7', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                flexShrink: 0, 
                                color: '#047857' 
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.5l-3.5-3.5 1.41-1.41L11 13.67l5.59-5.59L18 9.5l-7 7z"/>
                            </svg>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#064E3B', lineHeight: '1.45' }}>
                            <strong style={{ color: '#065F46', fontWeight: '800' }}>Keuntungan Ayam Certified Safe:</strong> Prioritas utama bagi Distributor dengan jaminan harga pasti dan potongan margin platform hanya Rp300/kg.
                        </div>
                    </div>

                    {/* LISTINGS SECTION */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#133020', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Listing Panen Saya ({listings.length})
                        </h2>
                    </div>

                    {listings.length === 0 ? (
                        <div className="input-group-card" style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B', borderRadius: '18px', backgroundColor: '#FFFFFF' }}>
                            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🍗</div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>Belum Ada Listing Panen</div>
                            <div style={{ fontSize: '11.5px', color: '#64748B', maxWidth: '300px', margin: '0 auto' }}>
                                Klik <strong>+ Pasang Iklan</strong> untuk memasarkan ayam siap panen bersertifikasi ke pembeli RPA mitra.
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {listings.map((listing) => (
                                <HarvestListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL PASANG IKLAN */}
                {showCreateModal && (
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
                                    📢 Pasang Iklan Panen ke Bursa RPA
                                </h3>
                                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#718096' }}>
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                        Pilih Siklus Kandang Aktif
                                    </label>
                                    <select
                                        value={selectedCycleId}
                                        onChange={(e) => handleCycleChange(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                    >
                                        {eligibleCycles.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.farm_name} - Kandang {c.coop_code} ({c.live_population} Ekor, Umur {c.current_age} Hari)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedCycle && (
                                    <div style={{ 
                                        backgroundColor: selectedCycle.is_withdrawal_safe ? '#F0FDF4' : '#FFFBEB', 
                                        border: selectedCycle.is_withdrawal_safe ? '1px solid #86EFAC' : '1px solid #FCD34D',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        color: selectedCycle.is_withdrawal_safe ? '#166534' : '#92400E'
                                    }}>
                                        {selectedCycle.is_withdrawal_safe ? (
                                            <div>✓ <strong>Status Aman:</strong> Kandang ini tidak memiliki masa henti obat aktif. Listing otomatis mendapatkan sertifikat <em>Withdrawal-Safe</em>.</div>
                                        ) : (
                                            <div>⚠️ <strong>Perhatian:</strong> Ada obat aktif. Tanggal aman panen tercepat adalah <strong>{selectedCycle.safe_harvest_date}</strong>.</div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                        Tanggal Rencana Panen / Pengambilan
                                    </label>
                                    <input
                                        type="date"
                                        value={data.available_date}
                                        onChange={(e) => setData('available_date', e.target.value)}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                    />
                                    {errors.available_date && <span style={{ color: '#DC2626', fontSize: '10px' }}>{errors.available_date}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                            Estimasi Tonase (kg)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.estimated_weight_kg}
                                            onChange={(e) => setData('estimated_weight_kg', e.target.value)}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                            Jumlah Ayam (Ekor)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.estimated_birds_count}
                                            onChange={(e) => setData('estimated_birds_count', e.target.value)}
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                        Harga Harapan Peternak (Rp / kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="100"
                                        value={data.base_price_per_kg}
                                        onChange={(e) => setData('base_price_per_kg', e.target.value)}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                    />
                                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '3px' }}>
                                        Harga tampil di portal RPA: <strong>Rp {offtakePrice.toLocaleString('id-ID')} / kg</strong> (Margin Angonku: Rp300/kg).
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                        Catatan Tambahan
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={2}
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
                                    {processing ? 'Menyimpan...' : 'Terbitkan Listing Panen'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* BOTTOM NAVIGATION WITH ACTIVE TAB PASAR */}
                <BottomNav activeTab="pasar" />
            </div>
        </>
    );
}
