<?php

namespace Database\Factories;

use App\Models\Frame;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Frame>
 */
class FrameFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'bg_image' => null,
            'base_svg' => null,
            'design_width' => 1200,
            'design_height' => 700,
            'is_active' => true,
        ];
    }
}
