<?php


namespace App\Repositories\Interfaces;


use App\Models\Location;
use Illuminate\Http\Request;

interface LocationRepository
{
    public function create(Request $request);

    public function update(Request $request, Location $location);

    public function remove(Location $location);
}
