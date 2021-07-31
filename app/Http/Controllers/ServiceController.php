<?php

namespace App\Http\Controllers;

use App\Http\Resources\ErrorResource;
use App\Http\Resources\ServiceCollection;
use App\Http\Resources\ServiceResource;
use App\Models\Shop;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\ServiceRepository;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CreateServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends ApiController
{
    protected ServiceRepository $repository;

    public function __construct(ServiceRepository $repository, Request $request)
    {
        parent::__construct($request);

        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : JsonResource
    {
        $shop = $this->apiRequest->shop;

        return new ServiceCollection(Service::with('template')->where('shop_id', $shop->id)->orderByDesc('name')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateServiceRequest  $request
     * @return JsonResponse
     */
    public function store(CreateServiceRequest $request)
    {
        try {
            $this->repository->create($request);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setMessage(__("Service added!"));
        return $this->successResponse($this->apiResponse);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Service  $service
     * @return JsonResource
     */
    public function show(Shop $shop, Service $service) : JsonResource
    {
        return new ServiceResource($service);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateServiceRequest  $request
     * @param  \App\Models\Service  $service
     * @return JsonResponse
     */
    public function update(UpdateServiceRequest $request, Shop $shop, Service $service) : JsonResponse
    {
        try {
            $this->repository->update($request, $service);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setMessage(__("Service modified!"));
        return $this->successResponse($this->apiResponse);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Service  $service
     * @return JsonResponse
     */
    public function destroy(Shop $shop, Service $service)
    {
        try {
            $this->repository->remove($service);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setMessage(__("Service removed!"));
        return $this->successResponse($this->apiResponse);
    }
}
