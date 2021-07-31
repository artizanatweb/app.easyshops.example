<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $user = Auth::user();
        if (1 === $user->user_type_id) {
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
        $actualId = $this->route('user')->id;
        $userType = $this->request->get('user_type_id');

        $rules = [
            'name' => ['bail', 'required', 'max:250', 'min:3'],
            'surname' => ['bail', 'required', 'max:250', 'min:3'],
            'email' => [
                'bail', 'required', 'email:rfc',
                Rule::unique('users')->ignore($actualId, 'id')
            ],
            'password' => ['max:250', 'min:' . env('MIX_ADMIN_MIN_PASSWORD_LENGTH', 8)],
            'phone' => ['bail', 'required', 'phone:AUTO,RO'],
            'file' => ['mimes:jpg,png', 'max:4048'],
            'user_type_id' => ['bail', 'required', 'numeric', Rule::exists('user_types', 'id')],
            'about_me' => ['max:1024'],
            'active' => ['boolean'],
        ];

        if (2 == $userType) {
            $shopId = $this->request->get("shop_id");
            if (!($shopId > 0)) {
                $this->request->remove("shop_id");
                return $rules;
            }

            $rules['shop_id'] = ['bail', 'required', 'numeric', Rule::exists('shops', 'id')];
        }

        if (3 == $userType) {
            $locationId = $this->request->get("location_id");
            if (!($locationId > 0)) {
                $this->request->remove("location_id");
                return $rules;
            }

            $rules['location_id'] = ['bail', 'required', 'numeric', Rule::exists('locations', 'id')];
        }

        return $rules;
    }
}
