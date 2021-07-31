<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'shop_id',
        'name',
        'description',
        'duration',
        'price',
    ];

    public function template()
    {
        return $this->hasOne(ServiceTemplate::class, "id", "service_template_id");
    }
}
