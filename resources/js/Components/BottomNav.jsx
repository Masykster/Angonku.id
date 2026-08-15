import { Link, usePage } from '@inertiajs/react';

export default function BottomNav({ activeTab = 'home' }) {
    const { active_cycle_id } = usePage().props;
    const fabHref = active_cycle_id 
        ? route('cycles.records.create', { cycle: active_cycle_id }) 
        : route('cycle.create');

    const user = usePage().props.auth?.user;
    const isKoperasi = user?.role === 'koperasi_admin';
    const isRpa = user?.role === 'rpa_buyer';

    const tabs = isKoperasi ? [
        { id: 'koperasi', label: 'Koperasi', icon: KoperasiIcon, href: route('koperasi.dashboard') },
        { id: 'pasar', label: 'Pasar B2B', icon: MarketplaceIcon, href: route('marketplace') },
        { id: 'spacer', label: '', icon: null },
        { id: 'rpa', label: 'Bursa RPA', icon: RpaIcon, href: route('rpa.portal') },
        { id: 'profil', label: 'Profil', icon: ProfilIcon, href: '/profile' },
    ] : isRpa ? [
        { id: 'rpa', label: 'Bursa RPA', icon: RpaIcon, href: route('rpa.portal') },
        { id: 'pasar', label: 'Pasar B2B', icon: MarketplaceIcon, href: route('marketplace') },
        { id: 'spacer', label: '', icon: null },
        { id: 'home', label: 'Dashboard', icon: HomeIcon, href: '/' },
        { id: 'profil', label: 'Profil', icon: ProfilIcon, href: '/profile' },
    ] : [
        { id: 'home', label: 'Home', icon: HomeIcon, href: '/' },
        { id: 'timeline', label: 'Timeline', icon: TimelineIcon, href: active_cycle_id ? route('cycle.show', { cycle: active_cycle_id }) : null },
        { id: 'spacer', label: '', icon: null },
        { id: 'pasar', label: 'Pasar', icon: MarketplaceIcon, href: route('marketplace') },
        { id: 'profil', label: 'Profil', icon: ProfilIcon, href: '/profile' },
    ];

    return (
        <>
            {/* FAB Button */}
            <Link href={fabHref} className="fab-button" aria-label="Tambah">
                <img
                    src="/images/fe_plus.png"
                    alt="Tambah"
                    width={24}
                    height={24}
                    className="fab-icon-img"
                />
            </Link>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                {tabs.map((tab) => {
                    if (tab.id === 'spacer') {
                        return <div key="spacer" className="nav-spacer" />;
                    }
                    const Icon = tab.icon;
                    
                    if (tab.href) {
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                <span className="nav-icon">
                                    <Icon active={activeTab === tab.id} />
                                </span>
                                <span className="nav-label">{tab.label}</span>
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            style={{ opacity: 0.6 }}
                        >
                            <span className="nav-icon">
                                <Icon active={activeTab === tab.id} />
                            </span>
                            <span className="nav-label">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
}

function HomeIcon({ active }) {
    return (
        <img
            src="/images/ooui_home.png"
            alt="Home"
            width={24}
            height={24}
            className={`nav-icon-img ${active ? 'active' : ''}`}
        />
    );
}

function TimelineIcon({ active }) {
    return (
        <img
            src="/images/ri_time-fill.png"
            alt="Timeline"
            width={24}
            height={24}
            className={`nav-icon-img ${active ? 'active' : ''}`}
        />
    );
}

function KesehatanIcon({ active }) {
    return (
        <img
            src="/images/ix_health-filled.png"
            alt="Kesehatan"
            width={24}
            height={24}
            className={`nav-icon-img ${active ? 'active' : ''}`}
        />
    );
}

function ProfilIcon({ active }) {
    return (
        <img
            src="/images/iconamoon_profile-fill.png"
            alt="Profil"
            width={24}
            height={24}
            className={`nav-icon-img ${active ? 'active' : ''}`}
        />
    );
}

function MarketplaceIcon({ active }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`nav-icon-img ${active ? 'active' : ''}`}
            style={{
                opacity: active ? 1 : 0.55,
                color: active ? 'var(--color-forest)' : '#A0A8A0',
                transition: 'all 0.2s ease',
            }}
        >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}

function KoperasiIcon({ active }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`nav-icon-img ${active ? 'active' : ''}`}
            style={{
                opacity: active ? 1 : 0.55,
                color: active ? 'var(--color-forest)' : '#A0A8A0',
                transition: 'all 0.2s ease',
            }}
        >
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
        </svg>
    );
}

function RpaIcon({ active }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`nav-icon-img ${active ? 'active' : ''}`}
            style={{
                opacity: active ? 1 : 0.55,
                color: active ? 'var(--color-forest)' : '#A0A8A0',
                transition: 'all 0.2s ease',
            }}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
        </svg>
    );
}

