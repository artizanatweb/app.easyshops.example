<?php


namespace App\Repositories\Interfaces;


use Illuminate\Http\Request;
use App\Models\ServiceTemplate;

interface ServiceTemplateRepository
{
    public function create(Request $request);

    public function update(Request $request, ServiceTemplate $serviceTemplate);

    public function remove(ServiceTemplate $serviceTemplate);
}
