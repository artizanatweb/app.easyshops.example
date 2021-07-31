<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ErrorResource extends JsonResource
{
    public string $message = "Resource not found!";

    public function with($request)
    {
        return [
            'success' => false,
            'message' => __($this->message),
        ];
    }

    public function withResponse($request, $response)
    {
        $response->setStatusCode(404);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
