<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\ResourceResponder;

class AuthUserResource extends JsonResource
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
        $resource = [
            'id' => $this->id,
            'name' => $this->name,
            'surname' => $this->surname,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'type' => $this->user_type_id,
        ];

        if (2 === optional($this->type)->id) {
            $shop = $this->shops->first();
            $resource['shop_id'] = $shop->id ?? 0;
        }

        if (3 === optional($this->type)->id) {
            $location = $this->locations->first();
            $resource['location_id'] = $location->id ?? 0;
        }

        return $resource;
    }
}
