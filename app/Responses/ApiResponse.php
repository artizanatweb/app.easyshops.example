<?php


namespace App\Responses;


class ApiResponse
{
    public bool $success = false;
    public string $message = "";
    public array $data = [];

    public function setSuccess(bool $value)
    {
        $this->success = $value;
    }

    public function setMessage(string $message)
    {
        $this->message = __($message);
    }

    public function setData(array $data)
    {
        $this->data = $data;
    }

    public function addData($value)
    {
        array_push($this->data, $value);
    }
}
