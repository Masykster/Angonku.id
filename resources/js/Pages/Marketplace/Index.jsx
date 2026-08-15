import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function MarketplaceIndex({ products = [], distributors = [], selectedCategory = 'all', searchQuery = '', myOrders = [] }) {
    const [category, setCategory] = useState(selectedCategory);
    const [search, setSearch] = useState(searchQuery);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('katalog'); // 'katalog' | 'pesanan'
    const [checkoutForm, setCheckoutForm] = useState({
        payment_method: 'Transfer Bank (BCA/Mandiri)',
        shipping_address: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { id: 'all', label: 'Semua Produk' },
        { id: 'pakan', label: 'Pakan Ternak' },
        { id: 'doc', label: 'DOC / Bibit' },
        { id: 'ovk', label: 'Obat & Vaksin' },
        { id: 'peralatan', label: 'Peralatan' },
    ];

    const handleCategoryChange = (catId) => {
        setCategory(catId);
        router.get(route('marketplace'), { category: catId, search }, { preserveState: true, preserveScroll: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('marketplace'), { category, search }, { preserveState: true, preserveScroll: true });
    };

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product_id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { product_id: product.id, product, quantity: 1, unit_price: parseFloat(product.price) }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (productId, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.product_id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const totalCartAmount = cart.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const platformCommission = Math.round(totalCartAmount * 0.05);

    const handleCheckout = (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setIsSubmitting(true);
        router.post(route('marketplace.order.store'), {
            items: cart.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
            payment_method: checkoutForm.payment_method,
            shipping_address: checkoutForm.shipping_address,
            notes: checkoutForm.notes,
        }, {
            onSuccess: () => {
                setCart([]);
                setIsCartOpen(false);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const getCategoryBadge = (cat) => {
        switch (cat) {
            case 'pakan':
                return { bg: '#FEF3C7', text: '#92400E', label: 'PAKAN' };
            case 'doc':
                return { bg: '#ECFDF5', text: '#065F46', label: 'DOC BIBIT' };
            case 'ovk':
                return { bg: '#EFF6FF', text: '#1E40AF', label: 'OVK / VAKSIN' };
            default:
                return { bg: '#F1F5F9', text: '#475569', label: 'SARANA' };
        }
    };

    return (
        <>
            <Head title="Pasar Input B2B - Pakan, DOC & OVK" />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                {/* HEADER */}
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '20px 20px 16px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                            <span style={{ fontSize: '11px', color: '#F0BE49', fontWeight: '700', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                                B2B INPUT MARKETPLACE
                            </span>
                            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: '2px 0 0', color: '#FFFFFF' }}>
                                Pasar Sarana Produksi Ternak
                            </h1>
                        </div>

                        {/* CART BUTTON */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            aria-label="Buka Keranjang Belanja"
                            style={{
                                position: 'relative',
                                backgroundColor: '#16A34A',
                                border: 'none',
                                color: 'white',
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(22, 163, 74, 0.35)'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            {cart.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    backgroundColor: '#D1603D',
                                    color: 'white',
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}>
                                    {cart.reduce((s, i) => s + i.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* SEARCH FORM */}
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                            type="text"
                            placeholder="Cari pakan, bibit DOC, vitamin, vaksin..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '9px 14px',
                                borderRadius: '12px',
                                border: 'none',
                                fontSize: '12.5px',
                                backgroundColor: '#FFFFFF',
                                color: '#1A202C'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#16A34A',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0 16px',
                                fontSize: '12.5px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Cari
                        </button>
                    </form>

                    {/* CATEGORY PILLS (NO SCROLLBAR) */}
                    <div 
                        style={{ 
                            display: 'flex', 
                            gap: '6px', 
                            overflowX: 'auto', 
                            paddingBottom: '2px',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                style={{
                                    whiteSpace: 'nowrap',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    border: category === cat.id ? '1.5px solid #F0BE49' : '1px solid rgba(255,255,255,0.15)',
                                    backgroundColor: category === cat.id ? '#F0BE49' : 'rgba(255,255,255,0.08)',
                                    color: category === cat.id ? '#133020' : 'white',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TABS SELECTOR */}
                <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
                    <button
                        onClick={() => setActiveTab('katalog')}
                        style={{
                            flex: 1,
                            padding: '12px 0',
                            border: 'none',
                            background: 'none',
                            fontSize: '12.5px',
                            fontWeight: activeTab === 'katalog' ? '800' : '600',
                            color: activeTab === 'katalog' ? '#133020' : '#64748B',
                            borderBottom: activeTab === 'katalog' ? '2.5px solid #133020' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Katalog Produk ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('pesanan')}
                        style={{
                            flex: 1,
                            padding: '12px 0',
                            border: 'none',
                            background: 'none',
                            fontSize: '12.5px',
                            fontWeight: activeTab === 'pesanan' ? '800' : '600',
                            color: activeTab === 'pesanan' ? '#133020' : '#64748B',
                            borderBottom: activeTab === 'pesanan' ? '2.5px solid #133020' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Riwayat Pesanan ({myOrders.length})
                    </button>
                </div>

                <div className="main-scroll" style={{ padding: '16px' }}>
                    {activeTab === 'katalog' ? (
                        <>
                            {/* NOTICE BANNER */}
                            <div style={{ backgroundColor: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: '14px', padding: '12px 14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>
                                    ✓
                                </div>
                                <div style={{ fontSize: '11px', color: '#064E3B', lineHeight: '1.4' }}>
                                    <strong>Harga Langsung Distributor Resmi:</strong> Seluruh produk dijamin asli dari pabrikan. Pemesanan skala grosir & komisi platform 5% terintegrasi otomatis.
                                </div>
                            </div>

                            {/* PRODUCTS GRID */}
                            {products.length === 0 ? (
                                <div className="input-group-card" style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>Produk Tidak Ditemukan</div>
                                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>Coba ubah kata kunci atau pilih kategori lain.</div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    {products.map((prod) => {
                                        const badge = getCategoryBadge(prod.category);
                                        return (
                                            <div
                                                key={prod.id}
                                                style={{
                                                    backgroundColor: '#FFFFFF',
                                                    borderRadius: '16px',
                                                    border: '1px solid #E2E8F0',
                                                    padding: '12px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <span style={{ backgroundColor: badge.bg, color: badge.text, fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px' }}>
                                                            {badge.label}
                                                        </span>
                                                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>
                                                            Stok: {prod.stock}
                                                        </span>
                                                    </div>

                                                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#133020', margin: '0 0 4px', lineHeight: '1.3' }}>
                                                        {prod.name}
                                                    </h3>

                                                    <div style={{ fontSize: '10px', color: '#64748B', marginBottom: '8px' }}>
                                                        {prod.distributor?.company_name || 'Distributor Resmi'}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#16A34A', marginBottom: '8px' }}>
                                                        Rp {parseFloat(prod.price).toLocaleString('id-ID')}
                                                        <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: '500' }}>/{prod.unit}</span>
                                                    </div>

                                                    <button
                                                        onClick={() => addToCart(prod)}
                                                        style={{
                                                            width: '100%',
                                                            backgroundColor: '#133020',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '10px',
                                                            padding: '7px 0',
                                                            fontSize: '11.5px',
                                                            fontWeight: '700',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '4px',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        <span>+</span>
                                                        <span>Keranjang</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        /* RIWAYAT PESANAN TAB */
                        <div>
                            {myOrders.length === 0 ? (
                                <div className="input-group-card" style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>Belum Ada Pesanan</div>
                                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px' }}>Pesanan sarana produksi ternak kamu akan tercatat di sini.</div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {myOrders.map((order) => (
                                        <div key={order.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '800', color: '#133020' }}>
                                                    Order #{order.id}
                                                </span>
                                                <span style={{
                                                    fontSize: '9.5px',
                                                    fontWeight: '800',
                                                    padding: '3px 8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: order.status === 'completed' ? '#ECFDF5' : '#FFFBEB',
                                                    color: order.status === 'completed' ? '#065F46' : '#92400E'
                                                }}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>

                                            <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>
                                                {order.items?.map((it) => `${it.product?.name} (${it.quantity}x)`).join(', ')}
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '8px', fontSize: '11.5px' }}>
                                                <span style={{ color: '#64748B' }}>Total Belanja:</span>
                                                <strong style={{ color: '#133020' }}>Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CART MODAL / DRAWER */}
                {isCartOpen && (
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
                            maxHeight: '85vh',
                            overflowY: 'auto'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#133020', margin: 0 }}>
                                    Keranjang Belanja ({cart.length})
                                </h3>
                                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#718096' }}>
                                    ✕
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B', fontSize: '13px' }}>
                                    Keranjang belanja masih kosong.
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                                        {cart.map((item) => (
                                            <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#133020' }}>{item.product.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>
                                                        Rp {item.unit_price.toLocaleString('id-ID')}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <button onClick={() => updateQuantity(item.product_id, -1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: 'white', cursor: 'pointer' }}>-</button>
                                                    <span style={{ fontSize: '12px', fontWeight: '700', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product_id, 1)} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: 'white', cursor: 'pointer' }}>+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* SUMMARY */}
                                    <div style={{ backgroundColor: '#F1F5F9', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '11.5px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span>Subtotal Produk:</span>
                                            <span>Rp {totalCartAmount.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#059669' }}>
                                            <span>Komisi Platform (5%):</span>
                                            <span>Rp {platformCommission.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '13px', borderTop: '1px solid #CBD5E1', paddingTop: '6px', marginTop: '6px', color: '#133020' }}>
                                            <span>Total Pembayaran:</span>
                                            <span>Rp {(totalCartAmount + platformCommission).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    {/* CHECKOUT FORM */}
                                    <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div>
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                                Alamat Pengiriman Kandang
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: Kandang A1, Desa Sukomoro, Kediri"
                                                value={checkoutForm.shipping_address}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, shipping_address: e.target.value })}
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                                                Metode Pembayaran
                                            </label>
                                            <select
                                                value={checkoutForm.payment_method}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, payment_method: e.target.value })}
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                                            >
                                                <option value="Transfer Bank (BCA/Mandiri)">Transfer Bank (BCA / Mandiri / BRI)</option>
                                                <option value="Kredit Koperasi / PayLater">Kredit Koperasi (Potong Panen)</option>
                                                <option value="COD / Bayar Saat Pengiriman">COD / Bayar Saat Pengiriman</option>
                                            </select>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            style={{
                                                marginTop: '8px',
                                                backgroundColor: '#16A34A',
                                                color: 'white',
                                                border: 'none',
                                                padding: '12px 0',
                                                borderRadius: '12px',
                                                fontSize: '13px',
                                                fontWeight: '800',
                                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Buat Pesanan'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <BottomNav activeTab="pasar" />
            </div>
        </>
    );
}
