<?php

namespace App\Http\Resources;

use App\Traits\ResourceResponder;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationAssetResource extends JsonResource
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
            'location_id' => $this->location_id,
            'asset_type_id' => $this->asset_type_id,
            'image' => $this->image,
            'thumbnail' => $this->thumbnail,
            'name' => $this->name,
            'default' => $this->default,
        ];
    }
}
