<?php


namespace App\Repositories;


use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use \Exception;
use App\Entities\PlacePhotoEntity;

class MapsPlaceRepository implements Interfaces\MapsPlaceRepository
{
    const MAX_PHOTO = 5;
    const MAX_WIDTH = 1024;

    protected string $placeDetails = "https://maps.googleapis.com/maps/api/place/details/json";
    protected string $placePhoto = "https://maps.googleapis.com/maps/api/place/photo";

    protected function getPlaceDetails(string $placeId) : Response
    {
        $params = [
            'key' => env('GOOGLE_MAPS_API_KEY'),
            'place_id' => $placeId,
        ];
        return Http::get($this->placeDetails, $params);
    }

    protected function getPhoto(string $photoReference, $maxWidth = self::MAX_WIDTH) : Response
    {
        $params = [
            'key' => env('GOOGLE_MAPS_API_KEY'),
            'photoreference' => $photoReference,
            'maxwidth' => $maxWidth,
        ];
        return Http::get($this->placePhoto, $params);
    }

    public function photos(string $placeId)
    {
        $photos = [];

        $rawResponse = $this->getPlaceDetails($placeId);
        if (!$rawResponse->ok()) {
            throw new Exception(__("Photos are not available for the moment!"));
        }

        $response = $rawResponse->collect("result");
        if (!$response) {
            throw new Exception(__("Photos are not available for the moment!"));
        }

        $placePhotos = $response->get("photos");
        if (!$placePhotos) {
            return $photos;
        }

        $photoReferences = [];
        foreach ($placePhotos as $placePhoto) {
            if (count($photoReferences) >= self::MAX_PHOTO) {
                break;
            }

            if (self::MAX_WIDTH > $placePhoto['width']) {
                continue;
            }

            $photoReferences[] = $placePhoto['photo_reference'];
        }

        if (!(count($photoReferences) > 0)) {
            return $photos;
        }

        foreach ($photoReferences as $reference) {
            $photoResponse = $this->getPhoto($reference);
            $photoDetails = $photoResponse->handlerStats();
            $photoType = $photoDetails['content_type'];
            $photoUrl = $photoDetails['url'];
            $photoBase64 = base64_encode($photoResponse);
            $photos[] = new PlacePhotoEntity($photoType, "data:$photoType;base64,$photoBase64", $photoUrl);
        }

        return $photos;
    }
}
