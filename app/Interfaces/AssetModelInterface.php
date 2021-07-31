<?php


namespace App\Interfaces;


interface AssetModelInterface
{
    public function setImage($image);

    public function setThumbnail($thumbnail);

    public function getImagePath() : ?string;

    public function getThumbnailPath() : ?string;

    public function clearImage();

    public function remove() : bool;
}
