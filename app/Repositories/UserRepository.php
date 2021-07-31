<?php


namespace App\Repositories;


use App\Models\User;
use \Exception;
use App\Traits\WithFilesRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CreateUserRequest;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateUserProfileRequest;

class UserRepository implements Interfaces\UserRepository
{
    use WithFilesRepository;

    public function create(CreateUserRequest $request)
    {
        $validatedData = $request->validated();

        $user = new User();
        $this->fieldsToObject($user, $validatedData);

        $user->active = false;
        if (isset($validatedData['active']) && "1" === $validatedData['active']) {
            $user->active = true;
        }

        if (isset($validatedData['file'])) {
            // upload and resize image
            $this->saveImageWithThumbnail($validatedData['file'], $user);
        }

        $saved = $user->save();
        if (!$saved) {
            throw new Exception("Can't create user!");
        }

        // based on user type, you should assign it to a shop or location
        $this->assign($user, $validatedData);
    }

    public function update(Request $request, User $user)
    {
        $validatedData = $request->validated();

        $this->fieldsToObject($user, $validatedData);

        if (isset($validatedData['active'])) {
            $user->active = ("1" === $validatedData['active']);
        }

        $image = $user->getImagePath();
        $thumbnail = $user->getThumbnailPath();

        $hasNewImage = false;
        if (isset($validatedData['file'])) {
            $hasNewImage = true;

            // upload and resize image
            $this->saveImageWithThumbnail($validatedData['file'], $user);
        }

        $saved = $user->save();
        if (!$saved) {
            throw new Exception("Can't modify user!");
        }

        if ($hasNewImage) {
            // remove actual image and thumbnail
            if (is_file(public_path($image))) {
                unlink(public_path($image));
            }

            if (is_file(public_path($thumbnail))) {
                unlink(public_path($thumbnail));
            }
        }

        if ($request instanceof UpdateUserProfileRequest) {
            return;
        }

        // based on user type, you should assign it to a shop or location
        $this->assign($user, $validatedData);
    }

    public function remove(User $user)
    {
        $requestingUser = Auth::user();
        if ($requestingUser->id == $user->id) {
            throw new Exception("You can't remove yourself!");
        }

        if (!($user->id > 1)) {
            throw new Exception("The first user cannot be removed from the system!");
        }

        $image = $user->getImagePath();
        $thumbnail = $user->getThumbnailPath();

        if (2 == $user->user_type_id) {
            $user->shops()->sync([]);
        }

        if (3 == $user->user_type_id) {
            $user->locations()->sync([]);
        }

        // remove user
        $removed = $user->delete();
        if (!$removed) {
            throw new Exception("Can't remove user from DB!");
        }

        // remove image and thumbnail
        if (is_file(public_path($image))) {
            unlink(public_path($image));
        }

        if (is_file(public_path($thumbnail))) {
            unlink(public_path($thumbnail));
        }
    }

    private function fieldsToObject(User $user, array $validatedData)
    {
        if (isset($validatedData['name'])) {
            $user->name = trim($validatedData['name']);
        }
        if (isset($validatedData['surname'])) {
            $user->surname = trim($validatedData['surname']);
        }
        if (isset($validatedData['email'])) {
            $user->email = trim($validatedData['email']);
        }
        if (isset($validatedData['password'])) {
            $user->password = Hash::make(trim($validatedData['password']));
        }
        if (isset($validatedData['phone'])) {
            $user->phone = trim($validatedData['phone']);
        }
        if (isset($validatedData['user_type_id'])) {
            $user->user_type_id = $validatedData['user_type_id'];
        }
        if (isset($validatedData['about_me'])) {
            $user->about_me = trim($validatedData['about_me']);
        }
    }

    private function assign(User $user, array $validatedData)
    {
        if (2 == $user->user_type_id) {
            $user->shops()->sync([]);
            if (isset($validatedData['shop_id'])) {
                $user->shops()->attach($validatedData['shop_id']);
            }
            return;
        }

        if (3 == $user->user_type_id) {
            $user->locations()->sync([]);
            if (isset($validatedData['location_id'])) {
                $user->locations()->attach($validatedData['location_id']);
            }
            return;
        }
    }
}
