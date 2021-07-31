<?php


namespace App\Repositories\Interfaces;


use Illuminate\Http\Request;
use App\Models\Service;

interface ServiceRepository
{
    public function create(Request $request);

    public function update(Request $request, Service $service);

    public function remove(Service $service);
}
