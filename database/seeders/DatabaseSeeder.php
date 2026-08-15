<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Cooperative;
use App\Models\Distributor;
use App\Models\Product;
use App\Models\HarvestListing;
use App\Models\Farm;
use App\Models\Coop;
use App\Models\Cycle;
use App\Models\DailyRecord;
use App\Models\DrugReference;
use App\Models\WeatherCache;
use App\Services\GoldenTimelineService;
use App\Services\CommodityService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Drug References
        DrugReference::insert([
            ['drug_name' => 'Amoksisilin', 'category' => 'antibiotic', 'withdrawal_days' => 10, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Enrofloksasin', 'category' => 'antibiotic', 'withdrawal_days' => 10, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Doksisiklin', 'category' => 'antibiotic', 'withdrawal_days' => 7, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Oksitetrasiklin', 'category' => 'antibiotic', 'withdrawal_days' => 10, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Tilosin', 'category' => 'antibiotic', 'withdrawal_days' => 5, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Kolistin', 'category' => 'antibiotic', 'withdrawal_days' => 7, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Neomycin', 'category' => 'antibiotic', 'withdrawal_days' => 5, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Vaksin ND (Newcastle)', 'category' => 'vaccine', 'withdrawal_days' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Vaksin IBD (Gumboro)', 'category' => 'vaccine', 'withdrawal_days' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Vaksin IB (Bronchitis)', 'category' => 'vaccine', 'withdrawal_days' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Vitamin C', 'category' => 'vitamin', 'withdrawal_days' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['drug_name' => 'Vitamin AD3E', 'category' => 'vitamin', 'withdrawal_days' => 0, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 2. Base Test User (Peternak Mandiri)
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'peternak',
            'phone' => '081234567891',
        ]);

        $farm = Farm::create([
            'user_id' => $user->id,
            'name' => 'Pibo Farm Kediri',
            'address' => 'Jl. Raya Papar No. 45, Kediri, Jawa Timur',
            'latitude' => -7.7124,
            'longitude' => 112.0734,
            'species' => 'broiler',
            'is_active' => true,
        ]);

        $coop = Coop::create([
            'farm_id' => $farm->id,
            'coop_code' => 'Kandang A1',
            'coop_type' => 'close_house',
            'capacity' => 6000,
            'area_m2' => 300,
            'is_active' => true,
        ]);

        $cycle = Cycle::create([
            'coop_id' => $coop->id,
            'doc_date' => now()->subDays(12)->toDateString(),
            'doc_count' => 6000,
            'strain' => 'Cobb',
            'target_days' => 35,
            'status' => 'active',
        ]);

        // Seed 12 daily records
        for ($i = 1; $i <= 12; $i++) {
            $recordDate = now()->subDays(13 - $i)->toDateString();
            $fcr = 1.1 + ($i * 0.03) + rand(-15, 15) / 1000;
            $mr = 0.1 + ($i * 0.08);
            $weight = 45 + ($i * 32);
            $livePop = 6000 - round($mr * 60);

            DailyRecord::create([
                'cycle_id' => $cycle->id,
                'record_date' => $recordDate,
                'day_number' => $i,
                'feed_kg' => 250.0 + ($i * 12.5),
                'mortality' => rand(0, 2),
                'avg_weight_g' => $weight,
                'live_population' => $livePop,
                'cum_feed_kg' => 250.0 * $i,
                'cum_mortality' => round($mr * 60),
                'fcr_current' => $fcr,
                'mortality_rate' => $mr,
                'condition' => 'good',
            ]);
        }

        // Weather cache & commodity prices
        WeatherCache::create([
            'farm_id' => $farm->id,
            'temperature_c' => 33.4,
            'humidity_pct' => 70,
            'weather_desc' => 'Cerah Berawan',
            'wind_speed' => 2.5,
            'alert_level' => 'warning',
            'alert_message' => 'Suhu tinggi — aktifkan ventilasi ekstra dan tambah air minum.',
            'fetched_at' => now(),
        ]);

        app(CommodityService::class)->seedMockPrices();

        // -------------------------------------------------------------
        // MODUL 1: B2B Enterprise SaaS Koperasi Seeding
        // -------------------------------------------------------------
        $cooperative = Cooperative::create([
            'name' => 'Koperasi Peternak Unggas Sejahtera',
            'license_status' => 'active',
            'subscription_expires_at' => now()->addMonths(6),
            'pic_name' => 'Ir. H. Slamet Raharjo',
            'phone' => '081234567890',
        ]);

        // Koperasi Admin User
        User::create([
            'name' => 'Admin Koperasi Unggas Sejahtera',
            'email' => 'koperasi@angonku.id',
            'password' => bcrypt('password'),
            'role' => 'koperasi_admin',
            'cooperative_id' => $cooperative->id,
            'phone' => '081234567890',
        ]);

        // Link base test user to cooperative
        $user->update(['cooperative_id' => $cooperative->id]);

        // 3 Member Farmers
        $member1 = User::create([
            'name' => 'Pak Joko Widodo Farm',
            'email' => 'peternak1@angonku.id',
            'password' => bcrypt('password'),
            'role' => 'peternak',
            'cooperative_id' => $cooperative->id,
            'phone' => '081234567811',
        ]);
        $farm1 = Farm::create([
            'user_id' => $member1->id,
            'name' => 'Barokah Unggas Farm',
            'address' => 'Desa Sambirejo, Pare, Kediri',
            'species' => 'broiler',
            'is_active' => true,
        ]);
        $coop1 = Coop::create([
            'farm_id' => $farm1->id,
            'coop_code' => 'K-01',
            'coop_type' => 'close_house',
            'capacity' => 8000,
            'area_m2' => 400,
            'is_active' => true,
        ]);
        $cycle1 = Cycle::create([
            'coop_id' => $coop1->id,
            'doc_date' => now()->subDays(25)->toDateString(),
            'doc_count' => 8000,
            'strain' => 'Ross',
            'target_days' => 35,
            'status' => 'active',
        ]);
        DailyRecord::create([
            'cycle_id' => $cycle1->id,
            'record_date' => now()->toDateString(),
            'day_number' => 25,
            'feed_kg' => 720.0,
            'mortality' => 2,
            'avg_weight_g' => 1420,
            'live_population' => 7880,
            'cum_feed_kg' => 11200.0,
            'cum_mortality' => 120,
            'fcr_current' => 1.48,
            'mortality_rate' => 1.5,
            'condition' => 'good',
        ]);

        $member2 = User::create([
            'name' => 'H. Sukirman Poultry',
            'email' => 'peternak2@angonku.id',
            'password' => bcrypt('password'),
            'role' => 'peternak',
            'cooperative_id' => $cooperative->id,
            'phone' => '081234567822',
        ]);
        $farm2 = Farm::create([
            'user_id' => $member2->id,
            'name' => 'Sumber Makmur Farm',
            'address' => 'Jl. Brantas No. 12, Plosoklaten, Kediri',
            'species' => 'broiler',
            'is_active' => true,
        ]);
        $coop2 = Coop::create([
            'farm_id' => $farm2->id,
            'coop_code' => 'K-02',
            'coop_type' => 'close_house',
            'capacity' => 10000,
            'area_m2' => 500,
            'is_active' => true,
        ]);
        $cycle2 = Cycle::create([
            'coop_id' => $coop2->id,
            'doc_date' => now()->subDays(31)->toDateString(),
            'doc_count' => 10000,
            'strain' => 'Cobb',
            'target_days' => 35,
            'status' => 'active',
        ]);
        DailyRecord::create([
            'cycle_id' => $cycle2->id,
            'record_date' => now()->toDateString(),
            'day_number' => 31,
            'feed_kg' => 980.0,
            'mortality' => 8,
            'avg_weight_g' => 1890,
            'live_population' => 9650,
            'cum_feed_kg' => 21800.0,
            'cum_mortality' => 350,
            'fcr_current' => 1.58,
            'mortality_rate' => 3.5,
            'condition' => 'warning',
        ]);

        $member3 = User::create([
            'name' => 'Budi Santoso Broiler',
            'email' => 'peternak3@angonku.id',
            'password' => bcrypt('password'),
            'role' => 'peternak',
            'cooperative_id' => $cooperative->id,
            'phone' => '081234567833',
        ]);
        $farm3 = Farm::create([
            'user_id' => $member3->id,
            'name' => 'Kandang Lestari Farm',
            'address' => 'Kecamatan Gurah, Kediri',
            'species' => 'broiler',
            'is_active' => true,
        ]);
        $coop3 = Coop::create([
            'farm_id' => $farm3->id,
            'coop_code' => 'K-03',
            'coop_type' => 'open_house',
            'capacity' => 5000,
            'area_m2' => 250,
            'is_active' => true,
        ]);
        $cycle3 = Cycle::create([
            'coop_id' => $coop3->id,
            'doc_date' => now()->subDays(18)->toDateString(),
            'doc_count' => 5000,
            'strain' => 'Cobb',
            'target_days' => 35,
            'status' => 'active',
        ]);
        DailyRecord::create([
            'cycle_id' => $cycle3->id,
            'record_date' => now()->toDateString(),
            'day_number' => 18,
            'feed_kg' => 410.0,
            'mortality' => 1,
            'avg_weight_g' => 840,
            'live_population' => 4910,
            'cum_feed_kg' => 5900.0,
            'cum_mortality' => 90,
            'fcr_current' => 1.42,
            'mortality_rate' => 1.8,
            'condition' => 'good',
        ]);

        // -------------------------------------------------------------
        // MODUL 2: B2B Input Marketplace Seeding
        // -------------------------------------------------------------
        $dist1 = Distributor::create([
            'name' => 'PT Charoen Pokphand Indonesia Tbk',
            'address' => 'Kawasan Industri Rungkut, Surabaya',
            'phone' => '031-8700100',
            'bank_account' => 'BCA 0182736451 a/n PT Charoen Pokphand',
        ]);
        $dist2 = Distributor::create([
            'name' => 'PT Japfa Comfeed Indonesia Tbk',
            'address' => 'Gedung Wisma Millenia, Sidoarjo',
            'phone' => '031-8533100',
            'bank_account' => 'Mandiri 142001928374 a/n PT Japfa Comfeed',
        ]);
        $dist3 = Distributor::create([
            'name' => 'PT Medion Farma Jaya',
            'address' => 'Jl. Babakan Ciparay No. 282, Bandung',
            'phone' => '022-6030612',
            'bank_account' => 'BCA 7770192834 a/n PT Medion Farma',
        ]);
        $dist4 = Distributor::create([
            'name' => 'PT Sierad Produce Tbk',
            'address' => 'Parung, Bogor, Jawa Barat',
            'phone' => '0251-8612000',
            'bank_account' => 'BRI 020901002345 a/n PT Sierad Produce',
        ]);
        $dist5 = Distributor::create([
            'name' => 'PT Malindo Feedmill Tbk',
            'address' => 'Jl. RS Fatmawati No. 15, Jakarta Selatan',
            'phone' => '021-7661727',
            'bank_account' => 'BNI 0987654321 a/n PT Malindo Feedmill',
        ]);

        // 15 Products
        $products = [
            // Pakan
            ['distributor_id' => $dist1->id, 'name' => 'Pakan Broiler Starter CP 511 Bravo', 'category' => 'pakan', 'price' => 485000, 'stock' => 150, 'unit' => 'sak 50kg', 'description' => 'Pakan masa awal kualitas tinggi dengan protein 21-23% untuk DOC.'],
            ['distributor_id' => $dist1->id, 'name' => 'Pakan Broiler Finisher CP 512', 'category' => 'pakan', 'price' => 470000, 'stock' => 200, 'unit' => 'sak 50kg', 'description' => 'Pakan masa akhir untuk pembesaran bobot panen maksimal.'],
            ['distributor_id' => $dist2->id, 'name' => 'Pakan Japfa Comfeed SB 11 Starter', 'category' => 'pakan', 'price' => 480000, 'stock' => 120, 'unit' => 'sak 50kg', 'description' => 'Formulasi asam amino lengkap untuk pertumbuhan seragam.'],
            ['distributor_id' => $dist2->id, 'name' => 'Pakan Japfa Comfeed SB 12 Finisher', 'category' => 'pakan', 'price' => 465000, 'stock' => 180, 'unit' => 'sak 50kg', 'description' => 'Memaksimalkan penyerapan energi dan mengoptimalkan FCR.'],
            ['distributor_id' => $dist5->id, 'name' => 'Pakan Malindo Starter 811', 'category' => 'pakan', 'price' => 475000, 'stock' => 90, 'unit' => 'sak 50kg', 'description' => 'Pakan pemula butiran crumble halus mudah dicerna.'],
            
            // DOC
            ['distributor_id' => $dist1->id, 'name' => 'DOC Ayam Broiler Cobb 500 Platinum', 'category' => 'doc', 'price' => 7200, 'stock' => 15000, 'unit' => 'ekor (min. 1 box)', 'description' => 'Bibit DOC unggul daya tahan tinggi dan FCR efisien.'],
            ['distributor_id' => $dist2->id, 'name' => 'DOC Ayam Broiler Ross 308 Super', 'category' => 'doc', 'price' => 7100, 'stock' => 12000, 'unit' => 'ekor (min. 1 box)', 'description' => 'Pertumbuhan cepat dan konversi daging dada optimal.'],
            ['distributor_id' => $dist4->id, 'name' => 'DOC Ayam Broiler Hubbard Flex', 'category' => 'doc', 'price' => 6900, 'stock' => 8000, 'unit' => 'ekor (min. 1 box)', 'description' => 'Bibit tangguh cocok untuk berbagai kondisi iklim kandang.'],

            // OVK (Obat, Vaksin, Kimia)
            ['distributor_id' => $dist3->id, 'name' => 'Medivac ND Clone 45 (1000 Dosis)', 'category' => 'ovk', 'price' => 45000, 'stock' => 80, 'unit' => 'vial', 'description' => 'Vaksin aktif pencegah Newcastle Disease (Tetelo).'],
            ['distributor_id' => $dist3->id, 'name' => 'Medivac Gumboro B (1000 Dosis)', 'category' => 'ovk', 'price' => 52000, 'stock' => 60, 'unit' => 'vial', 'description' => 'Vaksin aktif pencegah penyakit IBD / Gumboro.'],
            ['distributor_id' => $dist3->id, 'name' => 'Vita Stress Vitamin Anti-Stres 250gr', 'category' => 'ovk', 'price' => 38000, 'stock' => 100, 'unit' => 'bungkus', 'description' => 'Suplemen multivitamin lengkap pencegah stres saat vaksinasi / cuaca panas.'],
            ['distributor_id' => $dist3->id, 'name' => 'Enrovet Oral 100ml (Enrofloksasin)', 'category' => 'ovk', 'price' => 68000, 'stock' => 45, 'unit' => 'botol', 'description' => 'Antibiotik spektrum luas untuk CRD dan infeksi bakteri.'],
            ['distributor_id' => $dist3->id, 'name' => 'Neodox Oral 100gr (Doksisiklin)', 'category' => 'ovk', 'price' => 55000, 'stock' => 50, 'unit' => 'bungkus', 'description' => 'Antibiotik kombinasi ampuh untuk infeksi saluran pernapasan.'],

            // Peralatan
            ['distributor_id' => $dist4->id, 'name' => 'Nipple Drinker 360 Derajat Stainless', 'category' => 'peralatan', 'price' => 8500, 'stock' => 500, 'unit' => 'pcs', 'description' => 'Tempat minum otomatis anti-bocor dan higienis.'],
            ['distributor_id' => $dist4->id, 'name' => 'Pemanas Brooder Gas Semawar Gasolec', 'category' => 'peralatan', 'price' => 350000, 'stock' => 25, 'unit' => 'unit', 'description' => 'Pemanas induksi gas hemat konsumsi untuk penghangat DOC.'],
        ];

        foreach ($products as $prod) {
            Product::create($prod);
        }

        // -------------------------------------------------------------
        // MODUL 3: B2B Harvest Offtaking & RPA Portal Seeding
        // -------------------------------------------------------------
        // RPA Buyer User
        User::create([
            'name' => 'PT RPA Prima Meat Nusantara',
            'email' => 'rpa@angonku.id',
            'password' => bcrypt('password'),
            'role' => 'rpa_buyer',
            'phone' => '081199887766',
        ]);

        // 2 Ready Harvest Listings with Certified Withdrawal Safe
        HarvestListing::create([
            'cycle_id' => $cycle1->id,
            'user_id' => $member1->id,
            'farm_id' => $farm1->id,
            'available_date' => now()->addDays(3)->toDateString(),
            'estimated_weight_kg' => 14500.00,
            'estimated_birds_count' => 7800,
            'base_price_per_kg' => 22000.00,
            'offtake_price_per_kg' => 22300.00, // Rp22.000 + Rp300 margin
            'is_withdrawal_safe' => true,
            'status' => 'published',
            'notes' => 'Ayam rata-rata bobot 1.85 kg, seragam, bebas residu antibiotik (sertifikasi aman panen).',
        ]);

        HarvestListing::create([
            'cycle_id' => $cycle2->id,
            'user_id' => $member2->id,
            'farm_id' => $farm2->id,
            'available_date' => now()->addDays(4)->toDateString(),
            'estimated_weight_kg' => 18500.00,
            'estimated_birds_count' => 9600,
            'base_price_per_kg' => 22200.00,
            'offtake_price_per_kg' => 22500.00, // Rp22.200 + Rp300 margin
            'is_withdrawal_safe' => true,
            'status' => 'published',
            'notes' => 'Ayam super sehat bobot 1.92 kg, siap pickup armada truk thermoking RPA.',
        ]);
    }
}
