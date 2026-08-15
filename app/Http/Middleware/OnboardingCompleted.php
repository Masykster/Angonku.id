<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class OnboardingCompleted
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->isKoperasiAdmin() || $user->isRpaBuyer()) {
                return $next($request);
            }

            $hasFarm = $user->farms()->exists();

            if (!$hasFarm) {
                // If user has no farm and isn't on onboarding/logout, redirect to onboarding
                if (!$request->routeIs('onboarding') && !$request->routeIs('onboarding.store') && !$request->routeIs('logout')) {
                    return redirect()->route('onboarding');
                }
            } else {
                // If user already has a farm and is accessing onboarding, redirect to dashboard
                if ($request->routeIs('onboarding') || $request->routeIs('onboarding.store')) {
                    return redirect()->route('dashboard');
                }
            }
        }

        return $next($request);
    }
}
