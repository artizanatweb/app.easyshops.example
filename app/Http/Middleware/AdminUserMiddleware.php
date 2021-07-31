<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Responses\ApiResponse;
use App\Traits\UserWithTokens;

class AdminUserMiddleware
{
    use UserWithTokens;

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

        $user = auth()->user();
        // check for active user
        if (!$user->active) {
            $this->clearAccessTokens($user);

            $response->setMessage("This user is INACTIVE!");
            return response()->json($response, 403);
        }

        $userType = optional($user->type)->id ?? 5;
        if (!(5 > $userType)) {
            $this->clearAccessTokens($user);

            $response->setMessage("Request is not allowed for this user type!");
            return response()->json($response, 403);
        }

        return $next($request);
    }
}
