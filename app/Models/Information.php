<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Information extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'title',
        'description',
        'file_path',
        'mime_type',
        'urls',
        'date',
    ];

    protected $casts = [
        'urls' => 'array',
    ];

    /**
     * Append file_url to all model instances
     */
    protected $appends = ['file_url'];

    /**
     * Get the file URL accessor
     * This automatically converts storage paths to streamable URLs
     */
    public function getFileUrlAttribute(): string
    {
        if (filter_var($this->file_path, FILTER_VALIDATE_URL)) {
            return $this->file_path;
        }

        // if video then return stream url else the url.
        // if ($this->mime_type && str_starts_with($this->mime_type, 'video/')) {
        //     return route('video.stream', ['filename' => $this->file_path]);
        // }

        return Storage::disk('public')->url($this->file_path);
    }
}
