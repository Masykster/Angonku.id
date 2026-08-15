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
        Schema::create('cooperatives', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('license_status')->default('active'); // 'trial', 'active', 'expired'
            $table->timestamp('subscription_expires_at')->nullable();
            $table->string('pic_name');
            $table->string('phone')->nullable();
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('peternak'); // 'peternak', 'koperasi_admin', 'rpa_buyer'
            $table->foreignId('cooperative_id')->nullable()->constrained('cooperatives')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['cooperative_id']);
            $table->dropColumn(['role', 'cooperative_id']);
        });

        Schema::dropIfExists('cooperatives');
    }
};
