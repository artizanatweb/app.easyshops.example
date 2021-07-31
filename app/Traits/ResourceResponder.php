<?php


namespace App\Traits;


trait ResourceResponder
{
    public string $message = "";

    public function with($request)
    {
        return [
            'success' => true,
            'message' => $this->message,
        ];
    }
}
