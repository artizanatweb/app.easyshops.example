<?php

namespace App\Http\Controllers;


use App\Http\Resources\ServiceTemplateResource;
use App\Models\ServiceTemplate;
use App\Repositories\ServiceTemplateRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\ServiceTemplateCollection;
use App\Http\Requests\CreateServiceTemplateRequest;
use App\Http\Requests\UpdateServiceTemplateRequest;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Response;

class ServiceTemplateController extends ApiController
{
    protected ServiceTemplateRepository $repository;

    public function __construct(ServiceTemplateRepository $repository, Request $request)
    {
        parent::__construct($request);

        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResource
     */
    public function index() : JsonResource
    {
        return new ServiceTemplateCollection(ServiceTemplate::all()->sortByDesc('updated_at'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateServiceTemplateRequest  $request
     * @return JsonResponse
     */
    public function store(CreateServiceTemplateRequest $request) : JsonResponse
    {
        try {
            $this->repository->create($request);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setMessage(__("Service template added!"));
        return $this->successResponse($this->apiResponse);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ServiceTemplate  $serviceTemplate
     * @return JsonResource
     */
    public function show(ServiceTemplate $serviceTemplate) : JsonResource
    {
        return new ServiceTemplateResource($serviceTemplate);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateServiceTemplateRequest  $request
     * @param  \App\Models\ServiceTemplate  $serviceTemplate
     * @return JsonResponse
     */
    public function update(UpdateServiceTemplateRequest $request, ServiceTemplate $serviceTemplate) : JsonResponse
    {
        try {
            $this->repository->update($request, $serviceTemplate);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setMessage(__("Service template modified!"));
        return $this->successResponse($this->apiResponse);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ServiceTemplate  $serviceTemplate
     * @return JsonResponse
     */
    public function destroy(ServiceTemplate $serviceTemplate) : JsonResponse
    {
        try {
            $this->repository->remove($serviceTemplate);
        } catch (Exception $e) {
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }

        $this->apiResponse->setMessage(__("Service template removed!"));
        return $this->successResponse($this->apiResponse);
    }

    public function items()
    {
        return new ServiceTemplateCollection(ServiceTemplate::all()->sortBy('name'));
    }
}
