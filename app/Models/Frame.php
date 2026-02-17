<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Frame extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'bg_image',
        'base_svg',
        'design_width',
        'design_height',
        'is_active',
    ];

    protected $appends = [
        'bg_image_url',
        'base_svg_url',
    ];

    protected function casts(): array
    {
        return [
            'design_width' => 'integer',
            'design_height' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function elements(): HasMany
    {
        return $this->hasMany(FrameElement::class)->orderBy('sort_order');
    }

    public function getBgImageUrlAttribute(): ?string
    {
        if (! $this->bg_image) {
            return null;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url($this->bg_image);
    }

    public function getBaseSvgUrlAttribute(): ?string
    {
        if (! $this->base_svg) {
            return null;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url($this->base_svg);
    }
}
