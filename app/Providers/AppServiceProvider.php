<?php

namespace App\Providers;


use Illuminate\Support\ServiceProvider;
use App\Repositories\UserRepository;
use App\Repositories\ShopRepository;
use App\Repositories\LocationRepository;
use App\Repositories\MapsPlaceRepository;
use App\Repositories\ServiceTemplateRepository;
use App\Repositories\ServiceRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(\App\Repositories\Interfaces\UserRepository::class, UserRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ShopRepository::class, ShopRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\LocationRepository::class, LocationRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\MapsPlaceRepository::class, MapsPlaceRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ServiceTemplateRepository::class, ServiceTemplateRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ServiceRepository::class, ServiceRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
