<?php

namespace App\Providers;

use App\Models\Shop;
use App\Models\Location;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use App\Models\User;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::prefix('admin/api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/admin-api.php'));

            Route::prefix('admin')
                ->middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/admin.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });

        Route::bind('user_profile', function (int $value) {
            $user = null;
            try {
                $user = User::findOrFail($value);
            } catch (\Exception $e) {
                throw new \Exception(__("Profile is missing!"));
            }

            return $user;
        });

        Route::bind('shop_slug', function (string $code) {
            $shop = null;
            try {
                $shop = Shop::where('slug', $code)->firstOrFail();
            } catch (\Exception $e) {
                throw new \Exception(__("Shop not found!"));
            }

            return $shop;
        });

        Route::bind('shop', function (int $value) {
            $shop = null;
            try {
                $shop = Shop::findOrFail($value);
            } catch (\Exception $e) {
                throw new \Exception(__("Shop not found!"));
            }

            return $shop;
        });

        Route::bind('location', function (int $value) {
            $location = null;
            try {
                $location = Location::findOrFail($value);
            } catch (\Exception $e) {
                throw new \Exception(__("Location not found!"));
            }

            return $location;
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });

        RateLimiter::for('admin/api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}