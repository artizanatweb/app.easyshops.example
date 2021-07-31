<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserType;
use App\Models\AssetType;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->createUserTypes();
        $this->createAssetTypes();

        $this->createMainAdmin();
    }

    /**
     * Populate table with default platform values
     *
     * @return void
     */
    private function createUserTypes()
    {
        UserType::create([
            'id' => 1,
            'code' => 'admin',
            'name' => 'Super Admin'
        ]);

        UserType::create([
            'id' => 2,
            'code' => 'shop',
            'name' => 'Shop Admin'
        ]);

        UserType::create([
            'id' => 3,
            'code' => 'specialist',
            'name' => 'Shop Specialist'
        ]);

        UserType::create([
            'id' => 4,
            'code' => 'freelancer',
            'name' => 'Freelance Specialist'
        ]);

        UserType::create([
            'id' => 5,
            'code' => 'client',
            'name' => 'Client user'
        ]);
    }

    /**
     * Populate table with default platform values
     *
     * @return void
     */
    private function createMainAdmin()
    {
        User::create([
            'name' => 'Admin',
            'surname' => 'EasyShops',
            'email' => env('ADMIN_USER_EMAIL'),
            'password' => Hash::make(env('ADMIN_USER_PASSWD')),
            'user_type_id' => 1,
            'active' => true,
        ]);
    }

    private function createAssetTypes()
    {
        AssetType::create([
            'id' => 1,
            'name' => 'Image',
        ]);

        AssetType::create([
            'id' => 2,
            'name' => 'External video',
        ]);
    }
}
