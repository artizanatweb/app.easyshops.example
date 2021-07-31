<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Exception;

class CheckUserType
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $userType)
    {
        $types = [
            'admin' => [1],
            'shop'  => [1,2],
            'specialist' => [1,3],
            'freelancer' => [1,4],
        ];
        $userTypes = $types[$userType] ?? [];

        $response = new ApiResponse();

        if (!in_array(auth()->user()->type->id, $userTypes)) {
            $response->setMessage("Access denied!");
            return response()->json($response, 403);
        }

        $user = auth()->user();

        try {
            $this->checkShopAccess($user, $request);
        } catch (Exception $e) {
            $response->setMessage($e->getMessage());
            return response()->json($response, 403);
        }

        return $next($request);
    }

    private function checkShopAccess(User $user, Request $request)
    {
        if (1 === $user->type->id) {
            return;
        }

        if (!$request->route("shop")) {
            return;
        }

        $userShop = $user->shops->first();
        if (!$userShop) {
            throw new Exception("Access denied!");
        }

        $shop = $request->route("shop");
        if (!($userShop->id === $shop->id)) {
            throw new Exception("Access denied!");
        }
    }
}
