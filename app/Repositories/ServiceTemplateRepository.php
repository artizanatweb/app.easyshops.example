<?php


namespace App\Repositories;


use App\Models\ServiceTemplate;
use Illuminate\Http\Request;

class ServiceTemplateRepository implements Interfaces\ServiceTemplateRepository
{

    public function create(Request $request)
    {
        $validatedData = $request->validated();

        $serviceTemplate = new ServiceTemplate();
        $this->fieldsToObject($serviceTemplate, $validatedData);

        $saved = $serviceTemplate->save();
        if (!$saved) {
            throw new Exception(__("Can't create service template!"));
        }
    }

    public function update(Request $request, ServiceTemplate $serviceTemplate)
    {
        $validatedData = $request->validated();

        $this->fieldsToObject($serviceTemplate, $validatedData);

        $saved = true;
        if ($serviceTemplate->isDirty()) {
            $saved = $serviceTemplate->save();
        }

        if (!$saved) {
            throw new Exception(__("Can't change service template!"));
        }
    }

    public function remove(ServiceTemplate $serviceTemplate)
    {
        $removed = $serviceTemplate->delete();
        if (!$removed) {
            throw new Exception(__("Can't remove service template from DB!"));
        }
    }

    private function fieldsToObject(ServiceTemplate $template, array $validatedData)
    {
        if (isset($validatedData['name'])) {
            $template->name = trim($validatedData['name']);
        }

        if (isset($validatedData['duration'])) {
            $template->duration = trim($validatedData['duration']);
        }
    }
}
