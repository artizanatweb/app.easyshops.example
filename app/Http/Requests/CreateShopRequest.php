<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CreateShopRequest extends FormRequest
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
        return [
            'slug' => ['bail', 'required', 'unique:shops', 'max:250', 'min:3'],
            'name' => ['bail', 'required', 'max:250', 'min:3'],
            'description' => ['bail', 'required', 'min:8', 'max:5120'],
            'active' => ['boolean'],
            'file' => ['mimes:jpg,png', 'max:4048'],
        ];
    }
}
