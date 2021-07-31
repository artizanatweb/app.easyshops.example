<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\ResourceResponder;
use Carbon\Carbon;

class ShopResource extends JsonResource
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
        $locationsParam = count($this->locations);
        if ($request->shop_slug || $request->shop) {
            $locationsParam = new LocationCollection($this->locations);
        }

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'active' => $this->active,
            'image' => $this->image,
            'thumbnail' => $this->thumbnail,
            'last_update' => Carbon::createFromFormat('Y-m-d H:i:s', $this->updated_at)->format('d M Y'),
            'locations' => $locationsParam,
        ];
    }
}
