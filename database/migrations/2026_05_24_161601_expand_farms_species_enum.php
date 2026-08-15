<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE farms DROP CONSTRAINT IF EXISTS farms_species_check");
            DB::statement("ALTER TABLE farms ADD CONSTRAINT farms_species_check CHECK (species::text = ANY (ARRAY['broiler'::text, 'bebek'::text, 'lele'::text, 'nila'::text]))");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE farms DROP CONSTRAINT IF EXISTS farms_species_check");
            DB::statement("ALTER TABLE farms ADD CONSTRAINT farms_species_check CHECK (species::text = ANY (ARRAY['broiler'::text]))");
        }
    }
};
