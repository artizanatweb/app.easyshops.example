<?php


namespace App\Traits;

use App\Interfaces\AssetModelInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use \Exception;
use Illuminate\Http\UploadedFile;

trait WithFilesRepository
{
    protected function checkPath($path)
    {
        $done = true;
        if (!is_dir($path)) {
            $done = mkdir($path, 0777, true);
        }

        if (!$done) {
            throw new Exception("Can't create path! Please check files permissions.");
        }
    }

    protected function saveFile(Request $request, $requestFileKey = 'file', $uploadPath = 'uploads/users') : string
    {
        $this->checkPath(public_path('files/' . $uploadPath));
        // store image in public
        $fileExtension = $request->file($requestFileKey)->getClientOriginalExtension();
        $fileName = $request->code . '.' . time() . '.' . $fileExtension;
        $filePath = $request->file($requestFileKey)->storeAs($uploadPath, $fileName, 'custom');
        if (!$filePath) {
            throw new Exception("Can't save file to new location!");
        }

        return $filePath;
    }

    public function getRandomString() : string
    {
        return Str::random(8);
    }


    protected function saveImageWithThumbnail(UploadedFile $imageUpload, AssetModelInterface $assetModel, $uploadPath = 'uploads/users')
    {
        $uploadPublicPath = $uploadPath . '/uploads';
        $this->checkPath(public_path('files/' . $uploadPublicPath));
        $imagePublicPath = 'files/' . $uploadPath . '/images';
        $this->checkPath(public_path($imagePublicPath));
        $thumbnailPublicPath = 'files/' . $uploadPath . '/thumbnails';
        $this->checkPath(public_path($thumbnailPublicPath));

        $fileExtension = $imageUpload->getClientOriginalExtension();
        $fileName = $this->getRandomString() . '.' . time() . '.' . $fileExtension;
        $thumbnailName = $this->getRandomString() . '.' . time() . '.' . $fileExtension;
        $filePath = $imageUpload->storeAs($uploadPublicPath, $fileName, 'custom');

        $image = Image::make(public_path('files/' . $filePath));
        $image->resize(1024, 1024, function ($constraint) {
            $constraint->aspectRatio();
        });
        $imagePath = $imagePublicPath . '/' . $fileName;
        $image->save(public_path($imagePath));

        $thumbnail = Image::make(public_path('files/' . $filePath));
        $thumbnail->resize(540, 540, function ($constraint) {
            $constraint->aspectRatio();
        });
        $thumbnailPath = $thumbnailPublicPath . '/' . $thumbnailName;
        $thumbnail->save($thumbnailPath);

        $assetModel->setImage('/' . $imagePath);
        $assetModel->setThumbnail('/' . $thumbnailPath);

        unlink(public_path('files/' . $filePath));
    }

    private function clearFolder($folderPath)
    {
        if (!is_dir($folderPath)) {
            // folder not found -- move on
            return;
        }

        $folderHandler = opendir($folderPath);

        if (!$folderHandler) {
            throw new Exception("Can't open folder: " . $folderPath);
        }

        while($file = readdir($folderHandler)) {
            if (!in_array($file, [".",".."]) ) {
                if (is_dir($folderPath . "/" . $file)) {
                    $this->clearFolder($folderPath . "/" . $file);
                    continue;
                }

                unlink($folderPath . "/" . $file);
            }
        }

        closedir($folderHandler);
        rmdir($folderPath);
    }
}
