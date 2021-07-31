<?php

namespace App\Http\Resources;

use App\Traits\ResourceResponder;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
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
        $images = (optional($this->defaultImage)->id > 0) ? [new LocationAssetResource($this->defaultImage)] : null;
        if ($request->location) {
            $images = $this->assets;
        }

        return [
            'id' => $this->id,
            'shop_id' => $this->shop_id,
            'name' => $this->name,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'images' => $images,
            'location' => new LocationPointsResource($this->location),
        ];
    }
}
