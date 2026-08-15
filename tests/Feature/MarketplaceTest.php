<?php

use App\Models\User;
use App\Models\Distributor;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can browse marketplace and filter category', function () {
    $user = User::create([
        'name' => 'Peternak Buyer',
        'email' => 'buyer@example.com',
        'password' => bcrypt('password'),
        'role' => 'peternak',
        'is_active' => true,
    ]);

    \App\Models\Farm::create([
        'user_id' => $user->id,
        'name' => 'Farm Buyer',
        'species' => 'broiler',
        'is_active' => true,
    ]);

    $distributor = Distributor::create([
        'name' => 'PT Pakan Unggul',
        'address' => 'Surabaya',
        'phone' => '031-123456',
    ]);

    Product::create([
        'distributor_id' => $distributor->id,
        'name' => 'Pakan Starter 511',
        'category' => 'pakan',
        'price' => 450000,
        'stock' => 100,
        'unit' => 'sak',
    ]);

    $response = $this->actingAs($user)->get(route('marketplace', ['category' => 'pakan']));
    $response->assertStatus(200);
});

test('user can place order and calculate 5% platform commission', function () {
    $user = User::create([
        'name' => 'Peternak Checkout',
        'email' => 'checkout@example.com',
        'password' => bcrypt('password'),
        'role' => 'peternak',
        'is_active' => true,
    ]);

    \App\Models\Farm::create([
        'user_id' => $user->id,
        'name' => 'Farm Checkout',
        'species' => 'broiler',
        'is_active' => true,
    ]);

    $distributor = Distributor::create([
        'name' => 'PT Medion',
        'address' => 'Bandung',
        'phone' => '022-123456',
    ]);

    $product = Product::create([
        'distributor_id' => $distributor->id,
        'name' => 'Medivac ND Clone',
        'category' => 'ovk',
        'price' => 50000,
        'stock' => 50,
        'unit' => 'vial',
    ]);

    $response = $this->actingAs($user)->post(route('marketplace.order.store'), [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 4],
        ],
        'payment_method' => 'Transfer Bank',
        'shipping_address' => 'Kandang A Pare Kediri',
    ]);

    $response->assertRedirect(route('marketplace'));

    $order = Order::where('user_id', $user->id)->first();
    expect($order)->not->toBeNull();
    expect((float)$order->total_amount)->toEqual(200000.0);
    // 5% of 200,000 = 10,000
    expect((float)$order->platform_commission)->toEqual(10000.0);
    expect((float)$order->net_to_distributor)->toEqual(190000.0);

    // Stock deducted from 50 to 46
    $product->refresh();
    expect($product->stock)->toBe(46);
});
