<?php

namespace App\Http\Controllers;

use App\Http\Resources\ErrorResource;
use App\Http\Resources\ShopResource;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ShopCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use \Exception;
use App\Repositories\Interfaces\ShopRepository;
use App\Http\Requests\CreateShopRequest;
use App\Http\Requests\UpdateShopRequest;
use App\Http\Resources\ShopDetailsResource;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\ShopItemCollection;

class ShopController extends ApiController
{
    protected ShopRepository $repository;

    public function __construct(ShopRepository $repository, Request $request)
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
        return new ShopCollection(Shop::with('locations')->orderBy('updated_at','desc')->paginate(30));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateShopRequest  $request
     * @return JsonResponse
     */
    public function store(CreateShopRequest $request) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->create($request);
        } catch (Exception $e) {
            DB::rollBack();
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }
        DB::commit();

        return $this->successResponse($this->apiResponse);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Shop  $shop
     * @return JsonResource
     */
    public function show(Shop $shop) : JsonResource
    {
        return new ShopResource($shop);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateShopRequest  $request
     * @param  \App\Models\Shop  $shop
     * @return JsonResponse
     */
    public function update(UpdateShopRequest $request, Shop $shop) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->update($request, $shop);
        } catch (Exception $e) {
            DB::rollBack();
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }
        DB::commit();

        return $this->successResponse($this->apiResponse);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Shop  $shop
     * @return JsonResponse
     */
    public function destroy(Shop $shop) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->remove($shop);
        } catch (Exception $e) {
            DB::rollBack();
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }
        DB::commit();

        return $this->successResponse($this->apiResponse);
    }

    public function details(Shop $shop) : JsonResource
    {
        return new ShopResource($shop);
    }

    public function listItems()
    {
        return new ShopItemCollection(Shop::orderBy('updated_at','desc')->get(['id','name']));
    }
}
