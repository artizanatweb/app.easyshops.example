<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends ApiController
{
    public function index() : JsonResponse
    {
        $elements = [];

        $this->apiResponse->setData($elements);
        return $this->successResponse($this->apiResponse);
    }
}
