<?php

namespace App\Http\Middleware;

use App\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class AdminUserProfileMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = new ApiResponse();

        $userModel = $request->user_profile;
        if (!($userModel->id > 0)) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        if (!(auth()->user()->id === $userModel->id)) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        return $next($request);
    }
}
