<?php

namespace App\Http\Resources;

use App\Traits\ResourceResponder;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationItemResource extends JsonResource
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
            'name' => $this->name,
        ];
    }
}
