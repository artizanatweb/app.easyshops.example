<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class LocationAsset extends AssetModel
{
    use HasFactory;

    protected $fillable = [
        'location_id',
        'asset_type_id',
        'name',
        'image',
        'thumbnail',
        'url',
        'default',
    ];

    // use "composer require bensampo/laravel-embed"
    // for external video resources
    // https://github.com/BenSampo/laravel-embed
}
