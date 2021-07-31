<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\Admin\UserProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MapsPlaceController;
use App\Http\Controllers\ServiceTemplateController;
use App\Http\Controllers\ServiceController;

/*
|--------------------------------------------------------------------------
| ADMIN API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:admin')->group(function () {
    Route::middleware('admin-api')->group(function () {
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/users/types', [UserController::class, 'types']);
        /**
         * SuperAdmin routes
         */
        Route::middleware('checkUserType:admin')->group(function () {
            Route::apiResources([
                'users' => UserController::class,
                'shops' => ShopController::class,
                'service-templates' => ServiceTemplateController::class,
                // services
            ]);
            Route::get('/shops/{shop_slug}/details', [ShopController::class, 'details']);
            Route::get('/shops/list/select', [ShopController::class, 'listItems']);
            Route::get('/locations/list/select', [LocationController::class, 'listItems']);
        });
        /**
         * ShopAdmin routes
         */
        Route::middleware('checkUserType:shop')->group(function () {
            Route::post('/maps/place/photos', [MapsPlaceController::class, 'photos']);
            Route::apiResources([
                'shop.services' => ServiceController::class,
                'shop.locations' => LocationController::class,
            ]);
            Route::get('/service-templates/list/items', [ServiceTemplateController::class, 'items']);
            Route::apiResources(['details/shop' => ShopController::class], ['only' => ['show', 'update']]);
            Route::get('/user/shop/{shop}', [ShopController::class, 'details']);
            Route::get('/service-templates/items/select', [ServiceTemplateController::class, 'items']);
        });

        /**
         * profile edit routes
         */
        Route::middleware('user.admin.profile')->group(function () {
            Route::get('/user/{user_profile}/profile', [UserProfileController::class, 'index']);
            Route::get('/user/{user_profile}/profile/show', [UserProfileController::class, 'show']);
            Route::put('/user/{user_profile}/profile/update', [UserProfileController::class, 'update']);
        });
    });
});
