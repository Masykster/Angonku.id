import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function Marketplace() {
    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // Cart state
    const [cart, setCart] = useState([]);
    const [showCartDrawer, setShowCartDrawer] = useState(false);
    const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

    // Vet consultation modal state
    const [selectedVet, setSelectedVet] = useState(null);
    const [consultationStep, setConsultationStep] = useState('info'); // 'info' | 'chat'
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Categories definition
    const categories = [
        { id: 'all', label: 'Semua', icon: '🛍️' },
        { id: 'pakan', label: 'Pakan', icon: '🌾' },
        { id: 'obat', label: 'Obat & Vaksin', icon: '💊' },
        { id: 'perlengkapan', label: 'Perlengkapan', icon: '🛠️' },
        { id: 'dokter', label: 'Dokter Ternak', icon: '🩺' },
    ];

    // Mock Catalog Datasets
    const products = useMemo(() => [
        { id: 1, name: 'Pakan Broiler Starter BR-1', category: 'pakan', price: 350000, unit: 'sak (50kg)', rating: 4.9, sold: 120, imageEmoji: '🌾', description: 'Formulasi khusus anak ayam umur 1 - 21 hari dengan protein tinggi untuk pertumbuhan optimal.' },
        { id: 2, name: 'Vaksin ND-IB Clone (Unggas)', category: 'obat', price: 85000, unit: 'vial (500 dosis)', rating: 4.8, sold: 90, imageEmoji: '💉', description: 'Vaksin aktif untuk mencegah penyakit Newcastle Disease (tetelo) dan Infectious Bronchitis.' },
        { id: 3, name: 'Vitamin Ternak Gacor-Max 1L', category: 'obat', price: 120000, unit: 'botol', rating: 4.9, sold: 240, imageEmoji: '🧪', description: 'Multivitamin lengkap mendongkrak nafsu makan dan memperkuat daya tahan tubuh ternak.' },
        { id: 4, name: 'Nipple Drinker Otomatis A3', category: 'perlengkapan', price: 15000, unit: 'pcs', rating: 4.7, sold: 850, imageEmoji: '🚰', description: 'Nipple otomatis anti-bocor untuk efisiensi air minum higienis.' },
        { id: 5, name: 'Tempat Pakan Gantung 5kg', category: 'perlengkapan', price: 45000, unit: 'pcs', rating: 4.8, sold: 410, imageEmoji: '🪣', description: 'Wadah pakan berkualitas tinggi dengan desain gantung anti tumpah.' },
        { id: 6, name: 'Pakan Konsentrat Sapi Rumen-Feed', category: 'pakan', price: 280000, unit: 'sak (50kg)', rating: 4.9, sold: 75, imageEmoji: '🌾', description: 'Pakan konsentrat sapi pedaging berkualitas untuk percepatan penggemukan.' },
        { id: 7, name: 'Antibiotik Amoxytin 100g', category: 'obat', price: 65000, unit: 'bungkus', rating: 4.8, sold: 180, imageEmoji: '💊', description: 'Antibiotik berspektrum luas mengobati infeksi bakteri pernapasan dan pencernaan unggas.' },
        { id: 8, name: 'Alat Pengukur pH Air & Suhu Digital', category: 'perlengkapan', price: 95000, unit: 'unit', rating: 4.6, sold: 95, imageEmoji: '🌡️', description: 'Tester kualitas air digital presisi tinggi untuk optimalisasi air minum ternak.' },
    ], []);

    const veterinarians = useMemo(() => [
        { id: 101, name: 'drh. Rian Hermawan', specialty: 'Spesialis Unggas & Broiler', experience: '8 Tahun', rating: 4.9, price: 50000, status: 'online', imageEmoji: '👨‍⚕️', bio: 'Fokus pada biosekuriti kandang, pencegahan wabah virus unggas, dan program vaksinasi broiler.' },
        { id: 102, name: 'drh. Siti Aminah', specialty: 'Spesialis Ruminansia (Sapi/Kambing)', experience: '6 Tahun', rating: 4.8, price: 45000, status: 'online', imageEmoji: '👩‍⚕️', bio: 'Berpengalaman menangani gangguan metabolisme, reproduksi, dan pakan ternak berkuku belah.' },
        { id: 103, name: 'drh. Budi Santoso', specialty: 'Spesialis Bebek & Unggas Air', experience: '10 Tahun', rating: 4.9, price: 60000, status: 'busy', imageEmoji: '👨‍⚕️', bio: 'Ahli penanganan penyakit bebek petelur/pedaging dan manajemen kelembaban area kolam ternak.' },
        { id: 104, name: 'drh. Dewa Ayu', specialty: 'Nutrisi & Kesehatan Ternak', experience: '5 Tahun', rating: 4.7, price: 40000, status: 'online', imageEmoji: '👩‍⚕️', bio: 'Konsultasi formulasi pakan alternatif, FCR improvement, dan feed supplement untuk pertumbuhan cepat.' },
    ], []);

    // Filter items based on active category & search query
    const filteredProducts = useMemo(() => {
        if (activeCategory === 'dokter') return [];
        return products.filter(p => {
            const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, activeCategory, searchQuery]);

    const filteredVets = useMemo(() => {
        if (activeCategory !== 'all' && activeCategory !== 'dokter') return [];
        return veterinarians.filter(v => 
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [veterinarians, activeCategory, searchQuery]);

    // Cart Handlers
    const handleAddToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = () => {
        setShowCartDrawer(false);
        setShowCheckoutSuccess(true);
        setCart([]);
    };

    // Chat Simulation Handlers
    const startConsultation = (vet) => {
        setSelectedVet(vet);
        setConsultationStep('info');
        setChatMessages([
            { id: 1, sender: 'vet', text: `Halo! Saya ${vet.name}, ${vet.specialty}. Ada yang bisa saya bantu hari ini mengenai kesehatan ternak Anda?` }
        ]);
        setUserMessage('');
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;

        const newUserMsg = { id: Date.now(), sender: 'user', text: userMessage };
        setChatMessages(prev => [...prev, newUserMsg]);
        setUserMessage('');
        setIsTyping(true);

        // Simulated intelligent doctor replies
        setTimeout(() => {
            setIsTyping(false);
            const lower = newUserMsg.text.toLowerCase();
            let replyText = 'Baik, saya memahami keluhan Anda. Bisa tolong kirimkan foto kondisi ternak atau kotorannya? Serta informasikan apakah nafsu makan dan minumnya menurun.';
            
            if (lower.includes('pakan') || lower.includes('makan')) {
                replyText = 'Untuk nafsu makan yang menurun, disarankan memberikan suplemen vitamin B-kompleks dan memeriksa kualitas pakan dari jamur atau kelembaban yang berlebih.';
            } else if (lower.includes('pilek') || lower.includes('ngorok') || lower.includes('sesak')) {
                replyText = 'Gejala ngorok (CRD) biasanya disebabkan infeksi bakteri mycoplasma. Sebaiknya pisahkan ayam sakit, berikan antibiotik seperti Amoksisilin atau Doxycycline di air minum selama 3-5 hari.';
            } else if (lower.includes('mencret') || lower.includes('berak') || lower.includes('kotoran')) {
                replyText = 'Kotoran encer keputihan atau kehijauan mendeteksi adanya infeksi pencernaan. Jaga kekeringan sekam (litter) dan berikan obat herbal pencernaan atau antibiotik berspektrum luas.';
            }

            setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'vet', text: replyText }]);
        }, 1500);
    };

    return (
        <>
            <Head title="Marketplace Ternak & Konsultasi Dokter" />

            <div className="mobile-container" style={{ paddingBottom: '100px', backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                
                {/* Header Section */}
                <div style={{
                    backgroundColor: 'var(--color-forest)',
                    color: 'white',
                    padding: '20px 20px 16px',
                    borderRadius: '0 0 24px 24px',
                    boxShadow: '0 4px 12px rgba(50, 112, 57, 0.15)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '24px' }}>🏪</span>
                            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>Pasar Ternak</h1>
                        </div>
                        
                        {/* Cart Button */}
                        <button 
                            onClick={() => setShowCartDrawer(true)}
                            style={{
                                width: '40px', height: '40px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontSize: '20px' }}>🛒</span>
                            {cart.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: 'var(--color-cherry)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid var(--color-forest)'
                                }}>
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Search Input */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'white',
                        borderRadius: '16px',
                        padding: '10px 16px',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
                    }}>
                        <span style={{ marginRight: '8px', color: 'var(--color-text-secondary)', fontSize: '16px' }}>🔍</span>
                        <input 
                            type="text"
                            placeholder="Cari pakan, obat, alat, atau dokter..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '14px',
                                color: 'var(--color-text-dark)',
                                fontFamily: 'inherit',
                                background: 'transparent'
                            }}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        )}
                    </div>
                </div>

                {/* Category Chips Scrollbar */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '14px 16px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                border: '1.5px solid',
                                borderColor: activeCategory === cat.id ? 'var(--color-forest)' : '#E0DDD6',
                                background: activeCategory === cat.id ? 'var(--color-forest)' : '#FFF8EE',
                                color: activeCategory === cat.id ? 'white' : 'var(--color-text-dark)',
                                fontWeight: '700',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, padding: '0 16px' }}>
                    {/* Products Grid (Feeds, meds, tools) */}
                    {filteredProducts.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                            {filteredProducts.map((prod) => (
                                <div 
                                    key={prod.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '12px',
                                        border: '1px solid #F3EDE4',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {/* Product Image Holder */}
                                    <div style={{
                                        height: '110px',
                                        background: '#FFF8EE',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '44px',
                                        marginBottom: '10px',
                                        position: 'relative'
                                    }}>
                                        {prod.imageEmoji}
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '6px',
                                            right: '6px',
                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                            padding: '2px 6px',
                                            borderRadius: '6px',
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            color: 'var(--color-text-secondary)'
                                        }}>
                                            ⭐ {prod.rating}
                                        </span>
                                    </div>

                                    {/* Category Tag */}
                                    <span style={{
                                        fontSize: '9px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        color: prod.category === 'pakan' ? 'var(--color-forest)' : prod.category === 'obat' ? 'var(--color-cherry)' : 'var(--color-russet)',
                                        marginBottom: '4px'
                                    }}>
                                        {prod.category === 'pakan' ? '🌾 Pakan' : prod.category === 'obat' ? '💊 Obat/Vaksin' : '🛠️ Alat'}
                                    </span>

                                    {/* Product Title */}
                                    <h3 style={{
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: 'var(--color-text-dark)',
                                        margin: '0 0 6px',
                                        height: '38px',
                                        overflow: 'hidden',
                                        lineHeight: '1.3'
                                    }}>
                                        {prod.name}
                                    </h3>

                                    {/* Price & Unit */}
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-dark)' }}>
                                            Rp {prod.price.toLocaleString('id-ID')}
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                                            per {prod.unit}
                                        </div>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(prod)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 0',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: 'var(--color-forest)',
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseDown={e => e.currentTarget.style.opacity = 0.8}
                                        onMouseUp={e => e.currentTarget.style.opacity = 1}
                                    >
                                        Beli Sekarang
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Veterinarians Section */}
                    {filteredVets.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                            {activeCategory === 'all' && filteredProducts.length > 0 && (
                                <div style={{
                                    borderTop: '1.5px solid #F3EDE4',
                                    margin: '10px 0 16px',
                                    paddingTop: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ fontSize: '16px' }}>🩺</span>
                                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-dark)', margin: 0 }}>Rekomendasi Dokter Ternak</h3>
                                </div>
                            )}

                            {filteredVets.map((vet) => (
                                <div
                                    key={vet.id}
                                    style={{
                                        background: 'white',
                                        borderRadius: '20px',
                                        padding: '16px',
                                        border: '1px solid #F3EDE4',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.015)',
                                        display: 'flex',
                                        gap: '14px',
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '16px',
                                        background: '#FFF8EE',
                                        border: '1.5px solid #F5EAD6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        position: 'relative'
                                    }}>
                                        {vet.imageEmoji}
                                        <span style={{
                                            position: 'absolute',
                                            bottom: '-2px',
                                            right: '-2px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: vet.status === 'online' ? '#22C55E' : '#EAB308',
                                            border: '2px solid white'
                                        }} />
                                    </div>

                                    {/* Doctor Info */}
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-dark)', margin: '0 0 2px' }}>
                                            {vet.name}
                                        </h4>
                                        <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: '0 0 4px' }}>
                                            {vet.specialty}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                                            <span>⭐ {vet.rating}</span>
                                            <span>•</span>
                                            <span>💼 {vet.experience} exp</span>
                                        </div>
                                    </div>

                                    {/* Consult Action */}
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-forest)' }}>
                                            Rp {vet.price.toLocaleString('id-ID')}
                                        </span>
                                        <button
                                            onClick={() => startConsultation(vet)}
                                            style={{
                                                padding: '8px 14px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: 'var(--color-forest)',
                                                color: 'white',
                                                fontWeight: '700',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                boxShadow: '0 3px 8px rgba(50, 112, 57, 0.2)'
                                            }}
                                        >
                                            Konsul
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No items found state */}
                    {filteredProducts.length === 0 && filteredVets.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-secondary)' }}>
                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🔍</span>
                            <p style={{ fontSize: '14px', fontWeight: '600' }}>Hasil tidak ditemukan</p>
                            <p style={{ fontSize: '12px', opacity: 0.8 }}>Coba kata kunci pencarian yang lain.</p>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation */}
                <BottomNav activeTab="pasar" />
            </div>

            {/* Shopping Cart Drawer Modal */}
            {showCartDrawer && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)'
                }} onClick={() => setShowCartDrawer(false)}>
                    <div style={{
                        width: '100%',
                        maxWidth: '430px',
                        backgroundColor: '#FFF8EE',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        maxHeight: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '24px 20px',
                        boxShadow: '0 -10px 25px rgba(0,0,0,0.12)',
                        borderTop: '1.5px solid #F5EAD6'
                    }} onClick={e => e.stopPropagation()}>
                        
                        {/* Drawer Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F3EDE4', paddingBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>🛒</span>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-dark)', margin: 0 }}>Keranjang Belanja</h3>
                            </div>
                            <button 
                                onClick={() => setShowCartDrawer(false)}
                                style={{ background: 'none', border: 'none', fontSize: '14px', color: '#94A3B8', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Tutup
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '16px' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>
                                    <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🛒</span>
                                    <span style={{ fontSize: '13px' }}>Keranjang belanja Anda kosong.</span>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div 
                                        key={item.id}
                                        style={{
                                            background: 'white',
                                            borderRadius: '16px',
                                            padding: '12px',
                                            border: '1px solid #F3EDE4',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        {/* Icon */}
                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFF8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                            {item.imageEmoji}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-dark)', margin: '0 0 2px' }}>
                                                {item.name}
                                            </h4>
                                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-dark)' }}>
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        {/* Quantity Selector */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF8EE', borderRadius: '8px', padding: '4px 8px' }}>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, -1)}
                                                style={{ border: 'none', background: 'none', fontWeight: '700', fontSize: '14px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                                            >
                                                -
                                            </button>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-dark)' }}>{item.quantity}</span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, 1)}
                                                style={{ border: 'none', background: 'none', fontWeight: '700', fontSize: '14px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Checkout Section */}
                        {cart.length > 0 && (
                            <div style={{ borderTop: '1.5px solid #F3EDE4', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>TOTAL HARGA</span>
                                    <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-forest)' }}>
                                        Rp {cartTotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: '16px',
                                        border: 'none',
                                        background: 'var(--color-forest)',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '15px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(50, 112, 57, 0.3)'
                                    }}
                                >
                                    Proses Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Checkout Success Popup */}
            {showCheckoutSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '300px' }}>
                        <span style={{ fontSize: '50px', display: 'block', marginBottom: '14px' }}>🎉</span>
                        <h3 className="modal-title">Pesanan Berhasil!</h3>
                        <p className="modal-text" style={{ fontSize: '13px', marginBottom: '18px' }}>
                            Kebutuhan ternak Anda sedang disiapkan dan akan segera dikirim ke alamat terdaftar. Terima kasih!
                        </p>
                        <button
                            onClick={() => setShowCheckoutSuccess(false)}
                            style={{
                                width: '100%',
                                padding: '10px 0',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--color-forest)',
                                color: 'white',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}

            {/* Veterinarian Consultation Chat Modal */}
            {selectedVet && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    backdropFilter: 'blur(2px)'
                }} onClick={() => setSelectedVet(null)}>
                    <div style={{
                        width: '100%',
                        maxWidth: '430px',
                        backgroundColor: '#FFF8EE',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        height: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 -10px 25px rgba(0,0,0,0.12)',
                        borderTop: '1.5px solid #F5EAD6',
                        overflow: 'hidden'
                    }} onClick={e => e.stopPropagation()}>
                        
                        {/* Vet Modal Header */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '16px 20px', 
                            backgroundColor: 'white', 
                            borderBottom: '1px solid #F3EDE4'
                        }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FFF8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                {selectedVet.imageEmoji}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-dark)', margin: 0 }}>
                                    {selectedVet.name}
                                </h3>
                                <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                                    {selectedVet.specialty}
                                </span>
                            </div>
                            <button 
                                onClick={() => setSelectedVet(null)}
                                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94A3B8', marginLeft: 'auto', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Consultation step: Info */}
                        {consultationStep === 'info' ? (
                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                                <div style={{ background: 'white', borderRadius: '20px', padding: '16px', border: '1.5px solid #F3EDE4', marginBottom: '16px' }}>
                                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>BIOGRAFI DOKTER</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--color-text-dark)', margin: 0, lineHeight: '1.5' }}>
                                        {selectedVet.bio}
                                    </p>
                                </div>

                                <div style={{ background: 'white', borderRadius: '20px', padding: '16px', border: '1.5px solid #F3EDE4', marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>SYARAT & KETENTUAN KONSULTASI</h4>
                                    <ul style={{ fontSize: '12px', color: 'var(--color-text-dark)', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}>
                                        <li>Sesi konsultasi live berdurasi 30 menit.</li>
                                        <li>Bisa mengirim foto/video kendala kesehatan ternak.</li>
                                        <li>Biaya jasa langsung dipotong saat konsultasi disetujui.</li>
                                    </ul>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>BIAYA KONSUL</span>
                                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-forest)' }}>
                                            Rp {selectedVet.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        {/* Direct WhatsApp Redirection */}
                                        <a 
                                            href={`https://wa.me/628961706354?text=Halo%20${encodeURIComponent(selectedVet.name)}%2C%20saya%20peternak%20dari%20Angonku.id%20ingin%20berkonsultasi%20mengenai%20keluhan%20ternak...`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '12px',
                                                backgroundColor: '#22C55E',
                                                color: 'white',
                                                fontWeight: '700',
                                                fontSize: '14px',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)'
                                            }}
                                        >
                                            🟢 Hubungi via WhatsApp
                                        </a>

                                        {/* Interactive Live Chat Simulation */}
                                        <button
                                            onClick={() => setConsultationStep('chat')}
                                            style={{
                                                flex: 1,
                                                padding: '12px',
                                                borderRadius: '12px',
                                                backgroundColor: 'var(--color-forest)',
                                                color: 'white',
                                                fontWeight: '700',
                                                fontSize: '14px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 10px rgba(50, 112, 57, 0.2)'
                                            }}
                                        >
                                            💬 Mulai Live Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Live Chat Simulation View */
                            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 74px)' }}>
                                {/* Message Area */}
                                <div style={{ 
                                    flex: 1, 
                                    padding: '16px 20px', 
                                    overflowY: 'auto', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: '12px' 
                                }}>
                                    {chatMessages.map((msg) => (
                                        <div 
                                            key={msg.id} 
                                            style={{
                                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                                maxWidth: '75%',
                                                backgroundColor: msg.sender === 'user' ? 'var(--color-forest)' : 'white',
                                                color: msg.sender === 'user' ? 'white' : 'var(--color-text-dark)',
                                                borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                                padding: '10px 14px',
                                                fontSize: '13px',
                                                lineHeight: '1.4',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                                border: msg.sender === 'user' ? 'none' : '1px solid #F3EDE4'
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div style={{
                                            alignSelf: 'flex-start',
                                            backgroundColor: 'white',
                                            borderRadius: '16px 16px 16px 2px',
                                            padding: '10px 14px',
                                            fontSize: '12px',
                                            color: 'var(--color-text-secondary)',
                                            border: '1px solid #F3EDE4',
                                            display: 'flex',
                                            gap: '4px'
                                        }}>
                                            <span style={{ fontStyle: 'italic' }}>{selectedVet.name} sedang mengetik...</span>
                                        </div>
                                    )}
                                </div>

                                {/* Chat Action Input Footer */}
                                <form onSubmit={handleSendMessage} style={{
                                    padding: '12px 16px',
                                    backgroundColor: 'white',
                                    borderTop: '1px solid #F3EDE4',
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'center'
                                }}>
                                    <input 
                                        type="text"
                                        placeholder="Ketik pesan Anda..."
                                        value={userMessage}
                                        onChange={e => setUserMessage(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            border: '1.5px solid #E0DDD6',
                                            outline: 'none',
                                            fontSize: '13px',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                    <button 
                                        type="submit"
                                        style={{
                                            backgroundColor: 'var(--color-forest)',
                                            color: 'white',
                                            border: 'none',
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ➔
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
