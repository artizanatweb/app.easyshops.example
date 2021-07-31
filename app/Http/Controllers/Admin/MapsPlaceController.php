<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\MapsPlaceRepository;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\MapsPlaceRequest;
use \Exception;
use Symfony\Component\HttpFoundation\Response;

class MapsPlaceController extends ApiController
{
    protected MapsPlaceRepository $repository;

    public function __construct(MapsPlaceRepository $repository, Request $request)
    {
        parent::__construct($request);

        $this->repository = $repository;
    }

    public function photos(MapsPlaceRequest $request) : JsonResponse
    {
        $requestData = $request->validated();
        $photos = [];

        try {
            $photos = $this->repository->photos($requestData['place_id']);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setData($photos);
        return $this->successResponse($this->apiResponse);
    }
}
