<?php


namespace App\Repositories;


use App\Models\Service;
use Illuminate\Http\Request;

class ServiceRepository implements Interfaces\ServiceRepository
{

    public function create(Request $request)
    {
        $validatedData = $request->validated();

        $service = new Service();
        $service->shop_id = $request->shop->id;
        $this->fieldsToObject($service, $validatedData);

        $saved = $service->save();
        if (!$saved) {
            throw new Exception(__("Can't create service!"));
        }
    }

    public function update(Request $request, Service $service)
    {
        $validatedData = $request->validated();

        $this->fieldsToObject($service, $validatedData);

        $saved = true;
        if ($service->isDirty()) {
            $saved = $service->save();
        }

        if (!$saved) {
            throw new Exception(__("Can't change service!"));
        }
    }

    public function remove(Service $service)
    {
        $removed = $service->delete();
        if (!$removed) {
            throw new Exception(__("Can't remove service from DB!"));
        }
    }

    private function fieldsToObject(Service $service, array $validatedData)
    {
        if (isset($validatedData['service_template_id'])) {
            $service->service_template_id = trim($validatedData['service_template_id']);
        }


        if (isset($validatedData['name'])) {
            $service->name = trim($validatedData['name']);
        }

        if (isset($validatedData['duration'])) {
            $service->duration = trim($validatedData['duration']);
        }

        if (isset($validatedData['price'])) {
            $service->price = trim($validatedData['price']);
        }

        $service->description = "";
        if (isset($validatedData['description'])) {
            $service->description = trim($validatedData['description']);
        }
    }
}
