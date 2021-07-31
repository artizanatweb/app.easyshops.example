<?php


namespace App\Entities;


use Illuminate\Support\Str;

class PlacePhotoEntity
{
    public string $file;
    public string $type;
    public string $url;
    public string $name;

    public function __construct(string $type, string $file, string $url)
    {
        $this->type = $type;
        $this->file = $file;
        $this->url = $url;

        $name = $this->generateName();
        switch ($type) {
            case 'image/jpeg':
                $name .= ".jpg";
                break;
            case 'image/png':
                $name .= ".png";
                break;
            case 'image/gif':
                $name .= ".gif";
                break;
            default:
                $name .= ".jpg";
        }
        $this->name = $name;
    }

    private function generateName() : string
    {
        return Str::random(26);
    }
}
