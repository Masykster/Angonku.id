import { Head, Link } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNav';

export default function Checkout() {
    return (
        <>
            <Head title="Checkout Pesanan - Pasar Input B2B" />

            <div className="mobile-container" style={{ paddingBottom: '90px', backgroundColor: '#F7F3ED', minHeight: '100vh' }}>
                <div style={{ backgroundColor: '#133020', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link 
                        href={route('marketplace')} 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', textDecoration: 'none', color: 'white' }}
                    >
                        &larr;
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>Checkout Pesanan</h1>
                        <span style={{ fontSize: '11px', color: '#F0BE49' }}>Konfirmasi Sarana Produksi Ternak</span>
                    </div>
                </div>

                <div className="main-scroll" style={{ padding: '20px', textAlign: 'center' }}>
                    <div className="input-group-card" style={{ padding: '32px 16px', borderRadius: '16px', backgroundColor: '#FFFFFF' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</div>
                        <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#133020', marginBottom: '6px' }}>Pilih Produk di Pasar B2B</h2>
                        <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                            Silakan tambahkan produk ke keranjang langsung dari katalog Pasar Input B2B.
                        </p>
                        <Link
                            href={route('marketplace')}
                            style={{
                                display: 'inline-block',
                                backgroundColor: '#327039',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: '700',
                                textDecoration: 'none'
                            }}
                        >
                            Buka Katalog Pasar &rarr;
                        </Link>
                    </div>
                </div>

                <BottomNav activeTab="pasar" />
            </div>
        </>
    );
}
