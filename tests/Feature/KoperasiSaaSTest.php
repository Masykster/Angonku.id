<?php

use App\Models\User;
use App\Models\Cooperative;
use App\Models\Farm;
use App\Models\Coop;
use App\Models\Cycle;
use App\Models\DailyRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('koperasi admin can access cooperative dashboard with active license', function () {
    $cooperative = Cooperative::create([
        'name' => 'Koperasi Unggas Mandiri',
        'license_status' => 'active',
        'subscription_expires_at' => now()->addMonths(3),
        'pic_name' => 'Pak Ketua',
        'phone' => '08123456789',
    ]);

    $admin = User::create([
        'name' => 'Admin Koperasi',
        'email' => 'admin.kop@example.com',
        'password' => bcrypt('password'),
        'role' => 'koperasi_admin',
        'cooperative_id' => $cooperative->id,
        'is_active' => true,
    ]);

    $member = User::create([
        'name' => 'Peternak Binaan 1',
        'email' => 'member1@example.com',
        'password' => bcrypt('password'),
        'role' => 'peternak',
        'cooperative_id' => $cooperative->id,
        'is_active' => true,
    ]);

    $farm = Farm::create([
        'user_id' => $member->id,
        'name' => 'Kandang Binaan A',
        'address' => 'Kediri',
        'species' => 'broiler',
        'is_active' => true,
    ]);

    $coop = Coop::create([
        'farm_id' => $farm->id,
        'coop_code' => 'KA-01',
        'coop_type' => 'close_house',
        'capacity' => 5000,
        'is_active' => true,
    ]);

    $cycle = Cycle::create([
        'coop_id' => $coop->id,
        'doc_date' => now()->subDays(10)->toDateString(),
        'doc_count' => 5000,
        'strain' => 'Cobb',
        'target_days' => 35,
        'status' => 'active',
    ]);

    DailyRecord::create([
        'cycle_id' => $cycle->id,
        'record_date' => now()->toDateString(),
        'day_number' => 10,
        'feed_kg' => 200,
        'mortality' => 2,
        'avg_weight_g' => 320,
        'live_population' => 4950,
        'cum_feed_kg' => 1800,
        'cum_mortality' => 50,
        'fcr_current' => 1.35,
        'mortality_rate' => 1.0,
        'condition' => 'good',
    ]);

    $response = $this->actingAs($admin)->get(route('koperasi.dashboard'));
    $response->assertStatus(200);
});

test('non-admin user cannot access cooperative dashboard', function () {
    $peternak = User::create([
        'name' => 'Peternak Biasa',
        'email' => 'biasa@example.com',
        'password' => bcrypt('password'),
        'role' => 'peternak',
        'is_active' => true,
    ]);

    Farm::create([
        'user_id' => $peternak->id,
        'name' => 'Farm Biasa',
        'species' => 'broiler',
        'is_active' => true,
    ]);

    $response = $this->actingAs($peternak)->get(route('koperasi.dashboard'));
    $response->assertStatus(403);
});

test('koperasi admin with expired license is redirected with error', function () {
    $cooperative = Cooperative::create([
        'name' => 'Koperasi Expired',
        'license_status' => 'expired',
        'subscription_expires_at' => now()->subDay(),
        'pic_name' => 'Pak Ketua',
        'phone' => '08123456789',
    ]);

    $admin = User::create([
        'name' => 'Admin Expired',
        'email' => 'admin.exp@example.com',
        'password' => bcrypt('password'),
        'role' => 'koperasi_admin',
        'cooperative_id' => $cooperative->id,
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->get(route('koperasi.dashboard'));
    $response->assertRedirect(route('dashboard'));
});
