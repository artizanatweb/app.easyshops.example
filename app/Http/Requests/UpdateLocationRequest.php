<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateLocationRequest extends FormRequest
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

        if (2 === $user->user_type_id) {
           if ($this->route('location')->shop_id === $this->route('shop')->id) {
               return true;
           }
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
        return [
            'name' => ['bail', 'required', 'min:3', 'max:250'],
            'address' => ['bail', 'required', 'min:3', 'max:250'],
            'email' => ['nullable', 'email:rfc'],
            'phone' => ['nullable', 'phone:RO'],
            'location' => ['bail', 'required', 'array'],
            'location.lat' => ['bail', 'required', 'numeric', 'min:0'],
            'location.lng' => ['bail', 'required', 'numeric', 'min:0'],
            'images' => ['array'],
            'images.*' => [
                'mimes:jpg,png', 'max:4048'
            ],
            'imageDetails' => ['array'],
            'imageDetails.*.name' => ['max:200'],
            'imageDetails.*.default' => [Rule::in(["true","false"])],
        ];
    }
}
