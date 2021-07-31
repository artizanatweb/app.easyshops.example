<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shop extends AssetModel
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'active',
        'image',
        'thumbnail',
    ];

    public function locations()
    {
        return $this->hasMany(Location::class, 'shop_id', 'id');
    }

    public function admins()
    {
        return $this->belongsToMany(
            User::class, 'shop_admin', 'shop_id', 'user_id'
        )->withTimestamps();
    }
}
