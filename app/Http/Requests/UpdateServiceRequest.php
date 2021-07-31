<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
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
            // check if admin is assigned to shop
            $userShop = $user->shops->first();
            if (!$userShop) {
                return false;
            }

            $shop = $this->route("shop");
            if ($shop->id === $userShop->id) {
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
            'service_template_id' => ['bail', 'required', 'numeric', Rule::exists('service_templates', 'id')],
            'name' => ['bail', 'required', 'max:250', 'min:3'],
            'duration' => ['bail', 'required', 'numeric', 'between:1,1440'],
            'price' => ['bail', 'required', 'numeric', 'between:1.0,99999.9'],
            'description' => ['nullable', 'max:6000'],
        ];
    }
}
