<?php


namespace App\Traits;

use App\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;

trait ApiResponder
{
    protected function successResponse(ApiResponse $response, int $code = 200) : JsonResponse
    {
        $response->setSuccess(true);
        return response()->json($response, $code);
    }

    protected function errorResponse(ApiResponse $response, int $code = 200) : JsonResponse
    {
        $response->setSuccess(false);
        return response()->json($response, $code);
    }
}
