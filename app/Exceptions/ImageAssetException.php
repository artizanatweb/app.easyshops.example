<?php


namespace App\Exceptions;

use \Exception;

class ImageAssetException extends Exception
{
    private string $field;
    private string $assetKey;

    public function __construct($assetKey, $field = "", $message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);

        $this->assetKey = $assetKey;
        $this->field = $field;
    }

    public function getField()
    {
        return $this->field;
    }

    public function getAssetKey()
    {
        return $this->assetKey;
    }
}
