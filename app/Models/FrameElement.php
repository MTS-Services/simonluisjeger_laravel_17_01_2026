<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class FrameElement extends Model
{
    use HasFactory;

    protected $fillable = [
        'frame_id',
        'name',
        'overlay_image',
        'title',
        'description',
        'media_type',
        'media_url',
        'x_pct',
        'y_pct',
        'w_pct',
        'h_pct',
        'z_index',
        'sort_order',
    ];

    protected $appends = [
        'overlay_image_url',
        'media_file_url',
    ];

    protected function casts(): array
    {
        return [
            'x_pct' => 'float',
            'y_pct' => 'float',
            'w_pct' => 'float',
            'h_pct' => 'float',
            'z_index' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function frame(): BelongsTo
    {
        return $this->belongsTo(Frame::class);
    }

    public function getOverlayImageUrlAttribute(): ?string
    {
        return $this->overlay_image ? Storage::url($this->overlay_image) : null;
    }

    public function getMediaFileUrlAttribute(): ?string
    {
        if (! $this->media_url) {
            return null;
        }

        if (str_starts_with($this->media_url, 'http://') || str_starts_with($this->media_url, 'https://')) {
            return $this->media_url;
        }

        return Storage::url($this->media_url);
    }
}
