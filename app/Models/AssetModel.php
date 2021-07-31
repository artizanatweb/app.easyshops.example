<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use \App\Interfaces\AssetModelInterface;

abstract class AssetModel extends Model implements AssetModelInterface
{

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function setThumbnail($thumbnail)
    {
        $this->thumbnail = $thumbnail;
    }

    public function getImagePath(): ?string
    {
        return $this->image;
    }

    public function getThumbnailPath(): ?string
    {
        return $this->thumbnail;
    }

    public function clearImage()
    {
        if (is_file(public_path($this->thumbnail))) {
            unlink(public_path($this->thumbnail));
        }

        if (is_file(public_path($this->image))) {
            unlink(public_path($this->image));
        }
    }

    public function remove(): bool
    {
        $this->clearImage();

        return $this->delete();
    }
}
