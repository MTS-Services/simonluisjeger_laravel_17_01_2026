<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class Information extends Model
{
    protected $fillable = [
        'key',
        'title',
        'description',
        'video',
        'urls',
        'date',
    ];

    protected function casts(): array
    {
        return [
            'urls' => AsArrayObject::class,
        ];
    }
}
