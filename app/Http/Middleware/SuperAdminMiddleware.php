<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Responses\ApiResponse;
use Illuminate\Support\Facades\Auth;


class SuperAdminMiddleware
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

        $user = Auth::user();
        if (!(1 === $user->user_type_id)) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        return $next($request);
    }
}
