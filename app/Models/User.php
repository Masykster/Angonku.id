<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'province',
        'city',
        'avatar_url',
        'fcm_token',
        'failed_login',
        'locked_until',
        'is_active',
        'role',
        'cooperative_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'locked_until' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function isKoperasiAdmin(): bool
    {
        return $this->role === 'koperasi_admin';
    }

    public function isRpaBuyer(): bool
    {
        return $this->role === 'rpa_buyer';
    }

    public function isPeternak(): bool
    {
        return $this->role === 'peternak' || empty($this->role);
    }

    public function cooperative()
    {
        return $this->belongsTo(Cooperative::class);
    }

    public function farms()
    {
        return $this->hasMany(Farm::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function harvestListings()
    {
        return $this->hasMany(HarvestListing::class);
    }

    public function harvestContracts()
    {
        return $this->hasMany(HarvestContract::class, 'buyer_user_id');
    }
}
