<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HarvestContract extends Model
{
    use HasFactory;

    protected $fillable = [
        'harvest_listing_id',
        'buyer_user_id',
        'total_kg_purchased',
        'total_price',
        'platform_margin_fee',
        'status',
        'pickup_date',
    ];

    protected $casts = [
        'total_kg_purchased' => 'decimal:2',
        'total_price' => 'decimal:2',
        'platform_margin_fee' => 'decimal:2',
        'pickup_date' => 'date',
    ];

    public function listing()
    {
        return $this->belongsTo(HarvestListing::class, 'harvest_listing_id');
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_user_id');
    }
}
