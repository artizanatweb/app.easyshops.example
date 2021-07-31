<?php


namespace App\Repositories\Interfaces;

use App\Http\Requests\UpdateShopRequest;
use App\Http\Requests\CreateShopRequest;
use App\Models\Shop;

interface ShopRepository
{
    public function create(CreateShopRequest $request);

    public function update(UpdateShopRequest $request, Shop $shop);

    public function remove(Shop $shop);
}
