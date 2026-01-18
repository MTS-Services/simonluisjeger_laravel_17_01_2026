<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    protected $casts = [
        'urls' => 'array',
    ];

    /**
     * Append video_url to all model instances
     */
    protected $appends = ['video_url'];

    /**
     * Get the video URL accessor
     * This automatically converts storage paths to streamable URLs
     */
    public function getVideoUrlAttribute(): string
    {
        // Check if video is already a full URL (external link)
        if (filter_var($this->video, FILTER_VALIDATE_URL)) {
            return $this->video;
        }
        return route('video.stream', ['filename' => $this->video]);
    }
}
