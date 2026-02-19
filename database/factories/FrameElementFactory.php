<?php

namespace Database\Factories;

use App\Models\Frame;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FrameElement>
 */
class FrameElementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'frame_id' => Frame::factory(),
            'name' => $this->faker->unique()->word(),
            'overlay_image' => 'frames/elements/'.$this->faker->uuid().'.png',
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->sentence(8),
            'media_type' => null,
            'media_url' => null,
            'x_pct' => $this->faker->randomFloat(3, 0, 90),
            'y_pct' => $this->faker->randomFloat(3, 0, 90),
            'w_pct' => $this->faker->randomFloat(3, 5, 40),
            'h_pct' => $this->faker->randomFloat(3, 5, 40),
            'z_index' => $this->faker->numberBetween(0, 10),
            'rotation' => $this->faker->numberBetween(-45, 45),
            'hover_color' => $this->faker->optional()->hexColor(),
            'active_color' => $this->faker->optional()->hexColor(),
            'sort_order' => 1,
        ];
    }
}
