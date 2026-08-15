import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email) => {
        setData({
            ...data,
            email: email,
            password: 'password',
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <h2 className="auth-title">Selamat Datang! 👋</h2>
            <p className="auth-subtitle">Masuk ke akun Angonku kamu</p>

            {status && (
                <div className="auth-status-success">
                    {status}
                </div>
            )}

            {/* Quick Demo Role Selector */}
            <div style={{ marginBottom: '18px', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
                    ⚡ PILIH AKUN DEMO CEPAT (1-KLIK):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    <button
                        type="button"
                        onClick={() => fillDemo('test@example.com')}
                        style={{
                            padding: '6px 4px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: data.email === 'test@example.com' ? '#133020' : '#FFFFFF',
                            color: data.email === 'test@example.com' ? '#FFFFFF' : '#1E293B',
                            fontSize: '10.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Peternak
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemo('koperasi@angonku.id')}
                        style={{
                            padding: '6px 4px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: data.email === 'koperasi@angonku.id' ? '#133020' : '#FFFFFF',
                            color: data.email === 'koperasi@angonku.id' ? '#FFFFFF' : '#1E293B',
                            fontSize: '10.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Koperasi
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemo('rpa@angonku.id')}
                        style={{
                            padding: '6px 4px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: data.email === 'rpa@angonku.id' ? '#133020' : '#FFFFFF',
                            color: data.email === 'rpa@angonku.id' ? '#FFFFFF' : '#1E293B',
                            fontSize: '10.5px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Buyer RPA
                    </button>
                </div>
            </div>

            <form onSubmit={submit}>
                {/* Email */}
                <div className="auth-field">
                    <label htmlFor="login-email" className="auth-label">
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="auth-input"
                        placeholder="contoh@email.com"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="auth-error" />
                </div>

                {/* Password */}
                <div className="auth-field">
                    <label htmlFor="login-password" className="auth-label">
                        Kata Sandi
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="auth-input"
                        placeholder="Masukkan kata sandi"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="auth-error" />
                </div>

                {/* Remember + Forgot */}
                <div className="auth-row-between">
                    <label className="auth-checkbox-label">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="auth-checkbox"
                        />
                        <span>Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="auth-link"
                        >
                            Lupa kata sandi?
                        </Link>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="auth-btn-primary"
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>

                {/* Register Link */}
                <p className="auth-bottom-text">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="auth-link-bold">
                        Daftar Sekarang
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
