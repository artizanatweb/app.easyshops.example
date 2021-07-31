<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserTypeCollection;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserType;
use Illuminate\Support\Facades\DB;
use \Exception;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Repositories\Interfaces\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class UserController extends ApiController
{
    protected UserRepository $repository;

    public function __construct(UserRepository $repository, Request $request)
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
        return new UserCollection(User::with('type')->where('user_type_id', '<', 5)->orderBy('updated_at','desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateUserRequest  $request
     * @return JsonResponse
     */
    public function store(CreateUserRequest $request) : JsonResponse
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
     * @param  \App\Models\User  $user
     * @return JsonResource
     */
    public function show(User $user) : JsonResource
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateUserRequest  $request
     * @param  \App\Models\User  $user
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->update($request, $user);
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
     * @param  \App\Models\User  $user
     * @return JsonResponse
     */
    public function destroy(User $user) : JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->repository->remove($user);
        } catch (Exception $e) {
            DB::rollBack();
            $this->apiResponse->setMessage($e->getMessage());
            return $this->errorResponse($this->apiResponse, Response::HTTP_NOT_ACCEPTABLE);
        }
        DB::commit();

        return $this->successResponse($this->apiResponse);
    }

    public function types() : JsonResource
    {
        return new UserTypeCollection(UserType::where('id','<',5)->get());
    }
}
