<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Infromation extends Model
{
    protected $fillable = [
        'key',
        'title',
        'description',
        'video',
        'url_one',
        'url_two',
    ];
}
