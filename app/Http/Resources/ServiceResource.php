<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\ResourceResponder;

class ServiceResource extends JsonResource
{
    use ResourceResponder;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'shop_id' => $this->shop_id,
            'service_template_id' => $this->service_template_id,
            'name' => $this->name,
            'duration' => $this->duration,
            'price' => $this->price,
            'template' => new ServiceTemplateResource($this->template),
            'description' => $this->description,
            'last_update' => Carbon::createFromFormat('Y-m-d H:i:s', $this->updated_at)->format('d M Y'),
        ];
    }
}
