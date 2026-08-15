import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Angonku.id - Platform Manajemen Peternakan Cerdas & Ekosistem B2B" />

            <div className="min-h-[100dvh] bg-[#F7F3ED] text-[#133020] selection:bg-[#327039] selection:text-white">
                {/* TOP NAVBAR */}
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#133020]/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/PRIMARY LOGO 2.png"
                                alt="Angonku.id"
                                className="h-8 object-contain"
                            />
                        </div>

                        <nav className="flex items-center gap-3 sm:gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#327039] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#285b2e] transition-all"
                                >
                                    <span>Buka Dashboard</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#133020] hover:bg-black/5 transition"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#327039] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#285b2e] transition-all"
                                    >
                                        <span>Daftar Gratis</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* HERO SECTION */}
                <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[#133020]/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left Column: Heading & Value Prop */}
                            <div className="lg:col-span-7 flex flex-col items-start text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#327039]/10 border border-[#327039]/20 text-[#327039] text-xs font-bold tracking-wide uppercase mb-6">
                                    <span className="w-2 h-2 rounded-full bg-[#327039] animate-pulse"></span>
                                    Ekosistem Peternakan Ayam Terintegrasi
                                </div>

                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#133020] leading-[1.1] mb-6">
                                    Tingkatkan Profit Peternakan dengan <span className="text-[#327039]">Presisi & Ekosistem B2B</span>.
                                </h1>

                                <p className="text-base sm:text-lg text-[#133020]/80 leading-relaxed max-w-[60ch] mb-8">
                                    Pencatatan siklus kandang otomatis, panduan Golden Timeline AI, pemantauan cuaca BMKG, pengadaan sarana produksi grosir, dan penjualan panen langsung ke Rumah Potong Ayam (RPA).
                                </p>

                                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                                    <Link
                                        href={route('register')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#327039] text-white text-sm font-bold shadow-lg hover:bg-[#285b2e] hover:shadow-xl transition-all"
                                    >
                                        <span>Mulai Beternak Cerdas</span>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </Link>

                                    <Link
                                        href={route('login')}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#133020]/15 text-[#133020] text-sm font-bold shadow-xs hover:bg-[#F8FAFC] transition"
                                    >
                                        <span>Masuk Portal Demo</span>
                                    </Link>
                                </div>

                                {/* Micro Trust Stats */}
                                <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#133020]/10 w-full">
                                    <div>
                                        <div className="text-xl sm:text-2xl font-extrabold text-[#133020]">1.42</div>
                                        <div className="text-xs text-[#133020]/60 font-medium">Optimal FCR Target</div>
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-extrabold text-[#327039]">100%</div>
                                        <div className="text-xs text-[#133020]/60 font-medium">Withdrawal Safe</div>
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-extrabold text-[#F0BE49]">PDF KUR</div>
                                        <div className="text-xs text-[#133020]/60 font-medium">Bankable Report</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Interactive Live Card Showcase */}
                            <div className="lg:col-span-5 relative">
                                <div className="relative rounded-3xl bg-[#133020] text-white p-6 sm:p-7 shadow-2xl border border-white/10">
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#327039] flex items-center justify-center font-bold text-sm">
                                                🍗
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-[#F0BE49]">Kandang Utama - A1</div>
                                                <div className="text-sm font-extrabold">Siklus Broiler Cobb</div>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                            HARI KE-28
                                        </span>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                                            <div className="text-[11px] text-white/60">FCR Kumulatif</div>
                                            <div className="text-2xl font-extrabold text-white mt-0.5">1.44</div>
                                            <div className="text-[10px] text-emerald-400 font-semibold mt-1">✓ Di bawah standar 1.50</div>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                                            <div className="text-[11px] text-white/60">Populasi Hidup</div>
                                            <div className="text-2xl font-extrabold text-[#F0BE49] mt-0.5">5.912</div>
                                            <div className="text-[10px] text-white/60 mt-1">Mortalitas 1.4% (Rendah)</div>
                                        </div>
                                    </div>

                                    {/* Withdrawal Certification Badge */}
                                    <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-xs">
                                                ✓
                                            </div>
                                            <div className="text-xs">
                                                <span className="font-bold block text-emerald-300">Certified Withdrawal Safe</span>
                                                <span className="text-[10px] text-white/60">Bebas residu obat, siap offtake RPA</span>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-[#F0BE49]">Rp22.300/kg</span>
                                    </div>

                                    {/* AI Live Advisory Pill */}
                                    <div className="p-3 rounded-lg bg-white/10 text-xs text-white/80 flex items-center gap-2">
                                        <span className="text-amber-400 text-sm">💡</span>
                                        <span>Suhu puncak 33.4°C — Aktifkan blower ekstra & tambah elektrolit.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BENTO VALUE PROPOSITIONS */}
                <section className="py-16 sm:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-xs font-bold text-[#327039] uppercase tracking-wider">Fitur Unggulan</span>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#133020] tracking-tight mt-2">
                                4 Pilar Transformasi Peternakan Modern
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card 1 */}
                            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-4 font-bold text-lg">
                                        📅
                                    </div>
                                    <h3 className="text-base font-extrabold text-[#133020] mb-2">Golden Timeline AI</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Checklist harian otomatis mulai dari brooding, vaksinasi ND/IBD, manajemen ventilasi, hingga jadwal panen presisi.
                                    </p>
                                </div>
                                <div className="mt-6 pt-3 border-t border-slate-200/60 text-xs font-bold text-[#327039]">
                                    Terintegrasi Observasi Siklus &rarr;
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800 mb-4 font-bold text-lg">
                                        ⛅
                                    </div>
                                    <h3 className="text-base font-extrabold text-[#133020] mb-2">BMKG Weather Forecast</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Sinkronisasi ramalan cuaca 14 hari ke depan berdasarkan geolokasi kandang untuk mitigasi risiko heat stress ternak.
                                    </p>
                                </div>
                                <div className="mt-6 pt-3 border-t border-slate-200/60 text-xs font-bold text-sky-700">
                                    Prediksi Akurat BMKG &rarr;
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 mb-4 font-bold text-lg">
                                        🛒
                                    </div>
                                    <h3 className="text-base font-extrabold text-[#133020] mb-2">Pasar Input B2B</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Pesan pakan, bibit DOC unggul, dan vitamin langsung dari distributor resmi dengan jaminan harga grosir transparan.
                                    </p>
                                </div>
                                <div className="mt-6 pt-3 border-t border-slate-200/60 text-xs font-bold text-amber-700">
                                    Komisi Platform 5% &rarr;
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between">
                                <div>
                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 mb-4 font-bold text-lg">
                                        🍗
                                    </div>
                                    <h3 className="text-base font-extrabold text-[#133020] mb-2">Bursa Panen ke RPA</h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Jual hasil panen bersertifikat <em>Withdrawal-Safe</em> langsung ke Rumah Potong Ayam dengan margin harga pasti.
                                    </p>
                                </div>
                                <div className="mt-6 pt-3 border-t border-slate-200/60 text-xs font-bold text-emerald-700">
                                    Offtaking Bebas Residu &rarr;
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#133020] text-white py-10 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-extrabold text-sm tracking-tight text-[#F0BE49]">Angonku.id</span>
                            <span className="text-white/40 text-xs">|</span>
                            <span className="text-white/60 text-xs">Platform Manajemen Peternakan Cerdas</span>
                        </div>

                        <div className="text-xs text-white/50">
                            © 2026 Angonku.id. Seluruh hak cipta dilindungi.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
