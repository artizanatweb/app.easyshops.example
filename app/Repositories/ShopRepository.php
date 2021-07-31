<?php


namespace App\Repositories;


use App\Models\Shop;
use App\Http\Requests\UpdateShopRequest;
use App\Http\Requests\CreateShopRequest;
use Illuminate\Http\Request;
use \Exception;
use App\Traits\WithFilesRepository;

class ShopRepository implements Interfaces\ShopRepository
{
    use WithFilesRepository;

    public function create(CreateShopRequest $request)
    {
        $validatedData = $request->validated();

        $shop = new Shop();
        $this->fieldsToObject($shop, $validatedData);

        $shop->active = false;
        if (isset($validatedData['active']) && "1" === $validatedData['active']) {
            $shop->active = true;
        }

        if (isset($validatedData['file'])) {
            // upload and resize image
            $this->saveImageWithThumbnail($validatedData['file'], $shop, 'uploads/shops');
        }

        $saved = $shop->save();
        if (!$saved) {
            throw new Exception("Can't create shop!");
        }
    }

    public function update(UpdateShopRequest $request, Shop $shop)
    {
        $validatedData = $request->validated();

        $this->fieldsToObject($shop, $validatedData);

        if (isset($validatedData['active'])) {
            $shop->active = ("1" === $validatedData['active']);
        }

        $image = $shop->getImagePath();
        $thumbnail = $shop->getThumbnailPath();

        $hasNewImage = false;
        if (isset($validatedData['file'])) {
            $hasNewImage = true;

            // upload and resize image
            $this->saveImageWithThumbnail($validatedData['file'], $shop, 'uploads/shops');
        }

        $saved = $shop->save();
        if (!$saved) {
            throw new Exception("Can't modify shop!");
            throw new Exception("Can't modify shop!");
        }

        if ($hasNewImage) {
            // remove actual image and thumbnail
            if (is_file(public_path($image))) {
                unlink(public_path($image));
            }

            if (is_file(public_path($thumbnail))) {
                unlink(public_path($thumbnail));
            }
        }
    }

    public function remove(Shop $shop)
    {
        $image = $shop->getImagePath();
        $thumbnail = $shop->getThumbnailPath();

        // remove shop
        $removed = $shop->delete();
        if (!$removed) {
            throw new Exception("Can't remove shop from DB!");
        }

        // remove image and thumbnail
        if (is_file(public_path($image))) {
            unlink(public_path($image));
        }

        if (is_file(public_path($thumbnail))) {
            unlink(public_path($thumbnail));
        }
    }

    private function fieldsToObject(Shop $shop, array $validatedData)
    {
        if (isset($validatedData['slug'])) {
            $shop->slug = trim($validatedData['slug']);
        }
        if (isset($validatedData['name'])) {
            $shop->name = trim($validatedData['name']);
        }
        if (isset($validatedData['description'])) {
            $shop->description = trim($validatedData['description']);
        }
    }
}
