<?php


namespace App\Repositories\Interfaces;


use App\Models\User;
use App\Http\Requests\CreateUserRequest;
use Illuminate\Http\Request;

interface UserRepository
{
    public function create(CreateUserRequest $request);

    public function update(Request $request, User $user);

    public function remove(User $user);
}
