<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cooperative extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'license_status',
        'subscription_expires_at',
        'pic_name',
        'phone',
    ];

    protected $casts = [
        'subscription_expires_at' => 'datetime',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function farms()
    {
        return $this->hasManyThrough(Farm::class, User::class);
    }
}
