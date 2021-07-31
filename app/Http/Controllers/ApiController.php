<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\ApiResponder;
use App\Responses\ApiResponse;

abstract class ApiController extends Controller
{
    use ApiResponder;

    protected ApiResponse $apiResponse;
    protected Request $apiRequest;

    public function __construct(Request $request)
    {
        $this->apiResponse = new ApiResponse();
        $this->apiRequest = $request;
    }
}
