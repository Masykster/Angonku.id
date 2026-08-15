<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('harvest_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cycle_id')->constrained('cycles')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('farm_id')->constrained('farms')->cascadeOnDelete();
            $table->date('available_date');
            $table->decimal('estimated_weight_kg', 10, 2);
            $table->integer('estimated_birds_count');
            $table->decimal('base_price_per_kg', 10, 2);
            $table->decimal('offtake_price_per_kg', 10, 2); // base_price + 300
            $table->boolean('is_withdrawal_safe')->default(false);
            $table->string('status')->default('published'); // 'draft', 'published', 'reserved', 'sold'
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('harvest_contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('harvest_listing_id')->constrained('harvest_listings')->cascadeOnDelete();
            $table->foreignId('buyer_user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('total_kg_purchased', 10, 2);
            $table->decimal('total_price', 15, 2);
            $table->decimal('platform_margin_fee', 15, 2); // 300 * kg
            $table->string('status')->default('confirmed'); // 'pending', 'confirmed', 'completed', 'cancelled'
            $table->date('pickup_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('harvest_contracts');
        Schema::dropIfExists('harvest_listings');
    }
};
