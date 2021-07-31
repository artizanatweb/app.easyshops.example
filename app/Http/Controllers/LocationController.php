<?php

namespace App\Http\Controllers;

use App\Exceptions\ImageAssetException;
use App\Http\Requests\UpdateLocationRequest;
use App\Http\Resources\ErrorResource;
use App\Http\Resources\LocationItemCollection;
use App\Models\Location;
use App\Models\Shop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\LocationCollection;
use App\Http\Resources\LocationResource;
use App\Repositories\Interfaces\LocationRepository;
use App\Http\Requests\CreateLocationRequest;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class LocationController extends ApiController
{
    protected LocationRepository $repository;

    public function __construct(LocationRepository $repository, Request $request)
    {
        parent::__construct($request);

        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\Shop  $salon
     * @return JsonResource
     */
    public function index(Shop $shop) : JsonResource
    {
        return new LocationCollection(Location::with('defaultImage')->where('shop_id', $shop->id)->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateLocationRequest  $request
     * @return JsonResponse
     */
    public function store(CreateLocationRequest $request) : JsonResponse
    {
        // only street_name is mandatory
        DB::beginTransaction();
        try {
            $this->repository->create($request);
        } catch (ImageAssetException $iae) {
            DB::rollBack();
            $this->apiResponse->setMessage($iae->getMessage());
            $this->apiResponse->setData([
                $iae->getAssetKey() => $iae->getField()
            ]);
            return $this->errorResponse($this->apiResponse, Response::HTTP_METHOD_NOT_ALLOWED);
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
     * @param  \App\Models\Location  $location
     * @return JsonResource
     */
    public function show(Shop $shop, Location $location) : JsonResource
    {
        return new LocationResource($location);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateLocationRequest  $request
     * @param  \App\Models\Shop  $shop
     * @param  \App\Models\Location  $location
     * @return JsonResponse
     */
    public function update(UpdateLocationRequest $request, Shop $shop, Location $location) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->update($request, $location);
        } catch (ImageAssetException $iae) {
            DB::rollBack();
            $this->apiResponse->setMessage($iae->getMessage());
            $this->apiResponse->setData([
                $iae->getAssetKey() => $iae->getField()
            ]);
            return $this->errorResponse($this->apiResponse, Response::HTTP_METHOD_NOT_ALLOWED);
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
     * @param  \App\Models\Location  $location
     * @return JsonResponse
     */
    public function destroy(Shop $shop, Location $location) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->remove($location);
        } catch (Exception $e) {
            DB::rollBack();
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }
        DB::commit();

        return $this->successResponse($this->apiResponse);
    }

    public function listItems()
    {
        return new LocationItemCollection(Location::all()->sortByDesc('id'));
    }
}
