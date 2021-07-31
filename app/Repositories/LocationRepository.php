<?php


namespace App\Repositories;


use App\Interfaces\AssetModelInterface;
use App\Models\Location;
use Grimzy\LaravelMysqlSpatial\Types\Point;
use Illuminate\Http\Request;
use \Exception;
use App\Exceptions\ImageAssetException;
use App\Models\LocationAsset;
use App\Traits\WithFilesRepository;

class LocationRepository implements Interfaces\LocationRepository
{
    use WithFilesRepository;

    public function create(Request $request)
    {
        if (!(optional($request->shop)->id > 0)) {
            throw new Exception(__("Shop is missing!"));
        }

        $validatedData = $request->validated();

        $location = new Location();
        $location->shop_id = $request->shop->id;
        $this->fieldsToObject($location, $validatedData);

        $saved = $location->save();
        if (!$saved) {
            throw new Exception(__("Can't create shop location!"));
        }

        if (!isset($validatedData['images'])) {
            return;
        }

        $images = $validatedData['images'];
        $imageDetails = $validatedData['imageDetails'];
        if (!(count($images) > 0)) {
            return;
        }


        $hasDefaultAsset = false;
        $imageAssets = [];
        foreach ($images as $index => $image) {
            $details = $imageDetails[$index];
            $imgAsset = $this->addImage($image, $details, $location->id);
            $imageAssets[] = $imgAsset;
            if ($imgAsset->default) {
                $hasDefaultAsset = true;
            }
        }

        if (!(count($imageAssets) > 0)) {
            return;
        }

        if (!$hasDefaultAsset) {
            $imageAssets[0]->default = true;
            $imageAssets[0]->save();
        }
    }

    public function update(Request $request, Location $location)
    {
        $validatedData = $request->validated();

        $this->fieldsToObject($location, $validatedData);

        $saved = true;
        if ($location->isDirty()) {
            $saved = $location->save();
        }
        if (!$saved) {
            throw new Exception(__("Can't update shop location!"));
        }

        $this->updateImages($validatedData, $location);
    }

    public function remove(Location $location)
    {
        $locationId = $location->id;
        // remove images rows that belong to this location
        $deletedImages = LocationAsset::where('location_id', $locationId)->delete();

        // remove location
        $removed = $location->delete();
        if (!$removed) {
            throw new Exception("Can't remove product from DB!");
        }

        // remove assets folder and all its content
        $assetsFolderPath = public_path('files/uploads/locations/' . $locationId);
        $this->clearFolder($assetsFolderPath);
    }

    private function fieldsToObject(Location $location, array $validatedData)
    {
        if (isset($validatedData['name'])) {
            $location->name = trim($validatedData['name']);
        }

        if (isset($validatedData['address'])) {
            $location->address = trim($validatedData['address']);
        }

        if (isset($validatedData['location'])) {
            $location->location = new Point($validatedData['location']['lat'],$validatedData['location']['lng']);
        }

        $location->phone = "";
        if (isset($validatedData['phone'])) {
            $location->phone = trim($validatedData['phone']);
        }

        $location->email = "";
        if (isset($validatedData['email'])) {
            $location->email = trim($validatedData['email']);
        }
    }

    private function addImage($image, $details, int $locationId) : LocationAsset
    {
        if (!$image) {
            throw new ImageAssetException($details['assetKey'], "image", __("On image section, IMAGE File is mandatory!"));
        }

        $locationImage = new LocationAsset();
        $locationImage->location_id = $locationId;

        if (isset($details['name'])) {
            $locationImage->name = $details['name'];
        }

        if ('true' == $details['default']) {
            $locationImage->default = true;
        }

        $locationImage->asset_type_id = 1;

        $this->saveImageWithThumbnail($image, $locationImage, 'uploads/locations/' . $locationId);

        $locationImage->save();

        return $locationImage;
    }

    private function removeAsset(AssetModelInterface $asset)
    {
        if (!$asset->remove()) {
            throw new Exception("Can't remove asset!");
        }
    }

    private function updateImages(array $validatedData, Location $location)
    {
        $actualImages = $location->assets;
        $imageDetails = [];
        if (isset($validatedData['imageDetails'])) {
            $imageDetails = $validatedData['imageDetails'];
        }

        $images = null;
        if (isset($validatedData['images'])) {
            $images = $validatedData['images'];
        }

        $allImages = [];
        $hasDefaultAsset = false;
        $editedIds = [];
        if (count($imageDetails) > 0) {
            foreach ($imageDetails as $index => $details) {
                $image = false;
                if ($images && key_exists($index, $images)) {
                    $image = $images[$index];
                }

                if (!($details['id'] > 0)) {
                    // new image
                    $newAsset = $this->addImage($image, $details, $location->id);
                    $allImages[] = $newAsset;
                    continue;
                }

                array_push($editedIds, $details['id']);

                $locationImage = LocationAsset::find($details['id']);
                if (!($details['name'] == $locationImage->name)) {
                    $locationImage->name = $details['name'];
                }

                $locationImage->default = false;
                if (('true' == $details['default'])) {
                    $locationImage->default = true;
                    $hasDefaultAsset = true;
                }

                if($image) {
                    // replace old image
                    $locationImage->clearImage();

                    $this->saveImageWithThumbnail($image, $locationImage, 'uploads/locations/' . $location->id);
                }

                if ($locationImage->isDirty()) {
                    $locationImage->save();
                }

                $allImages[] = $locationImage;
            }
        }

        foreach ($actualImages as $index => $asset) {
            if (in_array($asset->id, $editedIds)) {
                $allImages[] = $asset;
                if ($asset->default) {
                    $hasDefaultAsset = true;
                }
                continue;
            }

            $this->removeAsset($asset);
        }

        if (!(count($allImages) > 0)) {
            return;
        }

        if (!$hasDefaultAsset) {
            $allImages[0]->default = true;
            $allImages[0]->save();
        }
    }
}
