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
        'text1_link_word',
        'text1_link_element_name',
        'text1_link_frame_element_id',
        'text1_link_color',
        'text1_link_underline',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'text1_link_underline' => 'boolean',
            'text1_link_frame_element_id' => 'integer',
        ];
    }
}
