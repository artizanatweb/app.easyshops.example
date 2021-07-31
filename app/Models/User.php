<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use App\Interfaces\AssetModelInterface;

class User extends Authenticatable implements AssetModelInterface
{
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'user_type_id',
        'phone',
        'about_me',
        'image',
        'thumbnail',
        'active',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function type()
    {
        return $this->hasOne(UserType::class, 'id', 'user_type_id');
    }

    public function shops()
    {
        return $this->belongsToMany(
            Shop::class, 'shop_admin','user_id','shop_id'
        )->withTimestamps();
    }

    public function locations()
    {
        return $this->belongsToMany(
            Location::class, 'location_specialist', 'user_id', 'location_id'
        )->withTimestamps();
    }

    public function setImage($image)
    {
        // TODO: Implement setImage() method.
        $this->image = $image;
    }

    public function setThumbnail($thumbnail)
    {
        // TODO: Implement setThumbnail() method.
        $this->thumbnail = $thumbnail;
    }

    public function getImagePath(): ?string
    {
        // TODO: Implement getImagePath() method.
        return $this->image;
    }

    public function getThumbnailPath(): ?string
    {
        // TODO: Implement getThumbnailPath() method.
        return $this->thumbnail;
    }

    public function clearImage()
    {
        // TODO: Implement clearImage() method.
        if (is_file(public_path($this->thumbnail))) {
            unlink(public_path($this->thumbnail));
        }

        if (is_file(public_path($this->image))) {
            unlink(public_path($this->image));
        }
    }

    public function remove(): bool
    {
        // TODO: Implement remove() method.
        $this->clearImage();

        return $this->delete();
    }
}
