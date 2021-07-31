<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateShopRequest extends FormRequest
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
            // check for shop ID and for user shop ID
            if ($this->route('shop')->id === optional($user->shops[0])->id) {
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
        $actualId = $this->route('shop')->id;

        return [
            'slug' => [
                'bail', 'required', 'max:250', 'min:3',
                Rule::unique('shops')->ignore($actualId, 'id')
            ],
            'name' => ['bail', 'required', 'max:250', 'min:3'],
            'description' => ['bail', 'required', 'min:8', 'max:5120'],
            'active' => ['boolean'],
            'file' => ['mimes:jpg,png', 'max:4048'],
        ];
    }
}
