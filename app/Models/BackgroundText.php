<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BackgroundText extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'text1',
        'text2',
        'background_color',
        'text_color',
        'text1_link_element_name',
    ];
}
