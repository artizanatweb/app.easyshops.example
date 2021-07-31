<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Traits\ResourceResponder;
use Carbon\Carbon;

class UserResource extends JsonResource
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
            'type' => $this->type,
            'phone' => $this->phone,
            'about_me' => $this->about_me,
            'image' => $this->image,
            'thumbnail' => $this->thumbnail,
            'active' => $this->active,
            'last_update' => Carbon::createFromFormat('Y-m-d H:i:s', $this->updated_at)->format('d M Y'),
        ];

        if (2 === optional($this->type)->id) {
            $resource['shop'] = $this->shops->first();
        }

        if (3 === optional($this->type)->id) {
            $resource['location'] = $this->locations->first();
        }

        return $resource;
    }
}
