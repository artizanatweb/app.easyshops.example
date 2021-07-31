<?php

namespace App\Http\Controllers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\AuthUserResource;

class AuthController extends ApiController
{
    public function user() : JsonResource
    {
        $loggedUser = Auth::user();

        return new AuthUserResource($loggedUser);
    }
}
