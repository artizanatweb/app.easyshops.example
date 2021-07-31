<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\ApiController;
use App\Http\Resources\ErrorResource;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Repositories\Interfaces\UserRepository;
use App\Http\Requests\UpdateUserProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UserProfileController extends ApiController
{
    protected UserRepository $repository;

    public function __construct(UserRepository $repository, Request $request)
    {
        parent::__construct($request);

        $this->repository = $repository;
    }

    public function index(User $user) : JsonResource
    {
        return new UserResource($user);
    }

    public function show(User $user) : JsonResource
    {
        return new UserResource($user);
    }

    public function update(UpdateUserProfileRequest $request, User $user) : JsonResponse
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
}
