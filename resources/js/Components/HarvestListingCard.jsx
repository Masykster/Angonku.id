import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function HarvestListingCard({ listing, onEdit }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format Indonesian Date (e.g. 20 Agt 2026)
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

    // Calculate relative time (e.g. "5 hari lagi")
    const getRelativeDays = (dateStr) => {
        if (!dateStr) return null;
        try {
            const target = new Date(dateStr);
            if (isNaN(target.getTime())) return null;
            target.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffTime = target.getTime() - today.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return 'Hari ini';
            if (diffDays === 1) return 'Besok';
            if (diffDays > 1) return `${diffDays} hari lagi`;
            if (diffDays < 0) return `${Math.abs(diffDays)} hari lalu`;
            return null;
        } catch {
            return null;
        }
    };

    // Sanitize coop name to avoid "Kandang Kandang A1 (-)"
    const formatCoopName = () => {
        const rawCode = listing.cycle?.coop?.coop_code || 'Kandang Utama';
        const cleanCoop = rawCode.toLowerCase().startsWith('kandang') ? rawCode : `Kandang ${rawCode}`;
        const farmName = listing.farm?.name;
        if (farmName && farmName !== '-') {
            return `${cleanCoop} · ${farmName}`;
        }
        return cleanCoop;
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        if (confirm('Batalkan dan hapus listing panen ini?')) {
            router.delete(route('harvest.listings.destroy', { id: listing.id }));
        }
    };

    const handleDownloadCertificate = () => {
        setIsMenuOpen(false);
        alert('Fitur Unduh Sertifikat PDF sedang disiapkan untuk siklus ini.');
    };

    const handleEditClick = () => {
        setIsMenuOpen(false);
        if (onEdit) {
            onEdit(listing);
        } else {
            alert('Edit listing: Silakan buat pengajuan penyesuaian baru jika listing belum dipesan.');
        }
    };

    const statusBadge = {
        published: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', label: 'LIVE DI BURSA PASAR' },
        reserved: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', label: 'DIPESAN RPA' },
        sold: { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', label: 'TERJUAL (SELESAI)' },
        draft: { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', label: 'DRAFT' },
    }[listing.status] || { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0', label: listing.status };

    const relativeDaysText = getRelativeDays(listing.available_date);

    return (
        <div
            className="input-group-card"
            style={{
                margin: 0,
                padding: '16px',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                position: 'relative'
            }}
        >
            {/* HEADER CARD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                    <span
                        style={{
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.text,
                            border: `1px solid ${statusBadge.border}`,
                            fontSize: '9.5px',
                            fontWeight: '800',
                            padding: '2.5px 7px',
                            borderRadius: '6px',
                            letterSpacing: '0.3px',
                            textTransform: 'uppercase'
                        }}
                    >
                        {statusBadge.label}
                    </span>

                    {listing.is_withdrawal_safe && (
                        <span
                            style={{
                                backgroundColor: '#133020',
                                color: '#FFFFFF',
                                border: '1px solid #327039',
                                fontSize: '9.5px',
                                fontWeight: '700',
                                padding: '2.5px 8px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#F0BE49">
                                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.5l-3.5-3.5 1.41-1.41L11 13.67l5.59-5.59L18 9.5l-7 7z" />
                            </svg>
                            Certified Withdrawal Safe
                        </span>
                    )}
                </div>

                {/* 3-DOTS OPTIONS DROPDOWN */}
                <div style={{ position: 'relative' }} ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Opsi Listing"
                        style={{
                            border: '1px solid #E2E8F0',
                            backgroundColor: isMenuOpen ? '#F1F5F9' : '#FFFFFF',
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748B',
                            fontSize: '14px',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        •••
                    </button>

                    {isMenuOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '34px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                                zIndex: 100,
                                minWidth: '170px',
                                padding: '6px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleEditClick}
                                style={{
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    padding: '8px 10px',
                                    fontSize: '11.5px',
                                    fontWeight: '600',
                                    color: '#1E293B',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>✏️</span> Edit Listing
                            </button>

                            <button
                                type="button"
                                onClick={handleDownloadCertificate}
                                style={{
                                    textAlign: 'left',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    padding: '8px 10px',
                                    fontSize: '11.5px',
                                    fontWeight: '600',
                                    color: '#1E293B',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span>📄</span> Unduh Sertifikat PDF
                            </button>

                            {listing.status !== 'sold' && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    style={{
                                        textAlign: 'left',
                                        border: 'none',
                                        backgroundColor: '#FFF1F2',
                                        padding: '8px 10px',
                                        fontSize: '11.5px',
                                        fontWeight: '700',
                                        color: '#E11D48',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginTop: '4px'
                                    }}
                                >
                                    <span>🗑️</span> Batalkan Listing
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* TITLE KANDANG */}
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#133020', margin: '4px 0 10px' }}>
                {formatCoopName()}
            </h3>

            {/* DATA GRID (3 KOLOM RINGKAS) */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                    backgroundColor: '#F8FAFC',
                    padding: '10px 12px',
                    borderRadius: '14px',
                    marginBottom: '10px'
                }}
            >
                {/* Kolom 1: Siap Panen */}
                <div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Siap Panen</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                        {formatIndoDate(listing.available_date)}
                    </div>
                    {relativeDaysText && (
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '9px',
                                fontWeight: '700',
                                color: '#047857',
                                backgroundColor: '#D1FAE5',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                marginTop: '3px'
                            }}
                        >
                            ({relativeDaysText})
                        </span>
                    )}
                </div>

                {/* Kolom 2: Est. Tonase */}
                <div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Est. Muatan</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                        {parseFloat(listing.estimated_weight_kg).toLocaleString('id-ID')} kg
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '500', marginTop: '2px' }}>
                        ({Math.abs(listing.estimated_birds_count || 0).toLocaleString('id-ID')} Ekor)
                    </div>
                </div>

                {/* Kolom 3: Harga Peternak */}
                <div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Harga Peternak</div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#047857', marginTop: '2px' }}>
                        Rp {parseFloat(listing.base_price_per_kg).toLocaleString('id-ID')}
                        <span style={{ fontSize: '9px', fontWeight: '500', color: '#64748B' }}>/kg</span>
                    </div>
                </div>
            </div>

            {/* FOOTER CARD */}
            <div
                style={{
                    borderTop: '1px dashed #E2E8F0',
                    paddingTop: '8px',
                    marginTop: '6px',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <div style={{ color: '#475569' }}>
                    <span style={{ color: '#64748B' }}>Harga Jual Ternak (+Rp300): </span>
                    <strong style={{ color: '#0F172A', fontWeight: '800' }}>
                        Rp {parseFloat(listing.offtake_price_per_kg).toLocaleString('id-ID')}/kg
                    </strong>
                </div>

                <div>
                    {listing.status === 'published' ? (
                        <span
                            style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#475569',
                                backgroundColor: '#F1F5F9',
                                border: '1px solid #E2E8F0',
                                padding: '3px 8px',
                                borderRadius: '6px'
                            }}
                        >
                            0 Penawaran Masuk
                        </span>
                    ) : listing.status === 'reserved' ? (
                        <span
                            style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#92400E',
                                backgroundColor: '#FEF3C7',
                                border: '1px solid #FDE68A',
                                padding: '3px 8px',
                                borderRadius: '6px'
                            }}
                        >
                            Dipesan RPA
                        </span>
                    ) : (
                        <span
                            style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#065F46',
                                backgroundColor: '#D1FAE5',
                                border: '1px solid #A7F3D0',
                                padding: '3px 8px',
                                borderRadius: '6px'
                            }}
                        >
                            Selesai Transaksi
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
