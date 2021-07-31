<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;

class Location extends Model
{
    use HasFactory;
    use SpatialTrait;

    protected $fillable = [
        'shop_id',
        'name',
        'address',
        'phone',
        'email',
    ];

    protected $spatialFields = [
        'location',
    ];

    public function specialist()
    {
        return $this->belongsToMany(
            User::class, 'location_specialist', 'location_id', 'user_id'
        )->withTimestamps();
    }

    public function shop()
    {
        return $this->hasOne(Shop::class, "id", "shop_id");
    }

    public function assets()
    {
        return $this->hasMany(LocationAsset::class, "location_id", "id");
    }

    public function defaultImage()
    {
        return $this->hasOne(LocationAsset::class, "location_id", "id")->where('default', 1);
    }
}
