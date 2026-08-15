<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'distributor_id',
        'name',
        'category',
        'price',
        'stock',
        'unit',
        'drug_reference_id',
        'image_url',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function distributor()
    {
        return $this->belongsTo(Distributor::class);
    }

    public function drugReference()
    {
        return $this->belongsTo(DrugReference::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
