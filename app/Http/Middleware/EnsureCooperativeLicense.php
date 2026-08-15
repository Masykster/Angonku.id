<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCooperativeLicense
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->isKoperasiAdmin()) {
            abort(403, 'Akses khusus administrator koperasi.');
        }

        $coop = $user->cooperative;
        if (!$coop || $coop->license_status !== 'active') {
            return redirect()->route('dashboard')->withErrors([
                'license' => 'Lisensi Koperasi Anda tidak aktif atau telah kedaluwarsa. Silakan hubungi tim Angonku untuk perpanjangan.'
            ]);
        }

        if ($coop->subscription_expires_at && $coop->subscription_expires_at->isPast()) {
            $coop->update(['license_status' => 'expired']);
            return redirect()->route('dashboard')->withErrors([
                'license' => 'Masa langganan Koperasi Anda telah habis. Silakan perpanjang lisensi.'
            ]);
        }

        return $next($request);
    }
}
