<?php

namespace App\Http\Resources;

use App\Traits\ResourceResponder;
use Illuminate\Http\Resources\Json\ResourceCollection;

class LocationItemCollection extends ResourceCollection
{
    use ResourceResponder;

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
