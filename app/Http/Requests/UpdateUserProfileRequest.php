<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateUserProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = Auth::user();
        if ($this->route('user_profile')->id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $actualId = $this->route('user_profile')->id;

        return [
            'name' => ['bail', 'required', 'max:250', 'min:3'],
            'surname' => ['bail', 'required', 'max:250', 'min:3'],
            'email' => [
                'bail', 'required', 'email:rfc',
                Rule::unique('users')->ignore($actualId, 'id')
            ],
            'password' => ['max:250', 'min:' . env('MIX_ADMIN_MIN_PASSWORD_LENGTH', 8)],
            'phone' => ['bail', 'required', 'phone:AUTO,RO'],
            'file' => ['mimes:jpg,png', 'max:4048'],
            'about_me' => ['max:1024'],
        ];
    }
}
