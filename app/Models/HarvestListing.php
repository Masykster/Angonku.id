<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HarvestListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'cycle_id',
        'user_id',
        'farm_id',
        'available_date',
        'estimated_weight_kg',
        'estimated_birds_count',
        'base_price_per_kg',
        'offtake_price_per_kg',
        'is_withdrawal_safe',
        'status',
        'notes',
    ];

    protected $casts = [
        'available_date' => 'date',
        'estimated_weight_kg' => 'decimal:2',
        'estimated_birds_count' => 'integer',
        'base_price_per_kg' => 'decimal:2',
        'offtake_price_per_kg' => 'decimal:2',
        'is_withdrawal_safe' => 'boolean',
    ];

    public function cycle()
    {
        return $this->belongsTo(Cycle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function contracts()
    {
        return $this->hasMany(HarvestContract::class);
    }
}
