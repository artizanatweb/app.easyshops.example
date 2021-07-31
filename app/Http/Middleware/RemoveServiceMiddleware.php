<?php

namespace App\Http\Middleware;

use App\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class RemoveServiceMiddleware
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
        if (1 === optional(auth()->user()->type)->id) {
            return $next($request);
        }

        $response = new ApiResponse();

        $userShop = auth()->user()->shops->first();
        if (!$userShop) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        $shopId = optional($request->shop)->id;
        if (!($shopId > 0)) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        if (!($shopId === $userShop->id)) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        return $next($request);
    }
}
