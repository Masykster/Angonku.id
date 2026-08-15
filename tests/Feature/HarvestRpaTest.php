<?php

use App\Models\User;
use App\Models\Farm;
use App\Models\Coop;
use App\Models\Cycle;
use App\Models\HarvestListing;
use App\Models\HarvestContract;
use App\Models\HealthRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('farmer can create harvest listing with withdrawal certification', function () {
    $user = User::create([
        'name' => 'Peternak Listing',
        'email' => 'seller@example.com',
        'password' => bcrypt('password'),
        'role' => 'peternak',
        'is_active' => true,
    ]);

    $farm = Farm::create([
        'user_id' => $user->id,
        'name' => 'Kandang Panen',
        'address' => 'Kediri',
        'species' => 'broiler',
        'is_active' => true,
    ]);

    $coop = Coop::create([
        'farm_id' => $farm->id,
        'coop_code' => 'KP-01',
        'coop_type' => 'close_house',
        'capacity' => 6000,
        'is_active' => true,
    ]);

    $cycle = Cycle::create([
        'coop_id' => $coop->id,
        'doc_date' => now()->subDays(30)->toDateString(),
        'doc_count' => 6000,
        'strain' => 'Cobb',
        'target_days' => 35,
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->post(route('harvest.listings.store'), [
        'cycle_id' => $cycle->id,
        'available_date' => now()->addDays(5)->toDateString(),
        'estimated_weight_kg' => 10000,
        'estimated_birds_count' => 5800,
        'base_price_per_kg' => 22000,
        'notes' => 'Ayam siap panen bobot seragam.',
    ]);

    $response->assertRedirect();

    $listing = HarvestListing::where('cycle_id', $cycle->id)->first();
    expect($listing)->not->toBeNull();
    expect($listing->is_withdrawal_safe)->toBeTrue();
    expect((float)$listing->base_price_per_kg)->toEqual(22000.0);
    // Rp22,000 + Rp300 margin
    expect((float)$listing->offtake_price_per_kg)->toEqual(22300.0);
});

test('rpa buyer can view portal and purchase harvest listing with margin fee calculation', function () {
    $farmer = User::create([
        'name' => 'Peternak Mitra',
        'email' => 'mitra@example.com',
        'password' => bcrypt('password'),
        'role' => 'peternak',
        'is_active' => true,
    ]);

    $rpaBuyer = User::create([
        'name' => 'Buyer RPA Jaya',
        'email' => 'buyer.rpa@example.com',
        'password' => bcrypt('password'),
        'role' => 'rpa_buyer',
        'is_active' => true,
    ]);

    $farm = Farm::create([
        'user_id' => $farmer->id,
        'name' => 'Kandang Mitra',
        'address' => 'Kediri',
        'species' => 'broiler',
        'is_active' => true,
    ]);

    $coop = Coop::create([
        'farm_id' => $farm->id,
        'coop_code' => 'KM-01',
        'coop_type' => 'close_house',
        'capacity' => 8000,
        'is_active' => true,
    ]);

    $cycle = Cycle::create([
        'coop_id' => $coop->id,
        'doc_date' => now()->subDays(30)->toDateString(),
        'doc_count' => 8000,
        'strain' => 'Cobb',
        'target_days' => 35,
        'status' => 'active',
    ]);

    $listing = HarvestListing::create([
        'cycle_id' => $cycle->id,
        'user_id' => $farmer->id,
        'farm_id' => $farm->id,
        'available_date' => now()->addDays(3)->toDateString(),
        'estimated_weight_kg' => 15000,
        'estimated_birds_count' => 7800,
        'base_price_per_kg' => 22000,
        'offtake_price_per_kg' => 22300,
        'is_withdrawal_safe' => true,
        'status' => 'published',
    ]);

    $portalResponse = $this->actingAs($rpaBuyer)->get(route('rpa.portal'));
    $portalResponse->assertStatus(200);

    $purchaseResponse = $this->actingAs($rpaBuyer)->post(route('rpa.purchase', ['id' => $listing->id]), [
        'pickup_date' => now()->addDays(3)->toDateString(),
        'notes' => 'Armada tiba jam 05.00 WIB',
    ]);

    $purchaseResponse->assertRedirect();

    $contract = HarvestContract::where('harvest_listing_id', $listing->id)->first();
    expect($contract)->not->toBeNull();
    expect((float)$contract->total_kg_purchased)->toEqual(15000.0);
    // 15,000 * 22,300 = 334,500,000
    expect((float)$contract->total_price)->toEqual(334500000.0);
    // Margin fee: 15,000 * 300 = 4,500,000
    expect((float)$contract->platform_margin_fee)->toEqual(4500000.0);

    $listing->refresh();
    expect($listing->status)->toBe('sold');
});
