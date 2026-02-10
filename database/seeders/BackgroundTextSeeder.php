<?php

namespace Database\Seeders;

use App\Models\BackgroundText;
use Illuminate\Database\Seeder;

class BackgroundTextSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $backgroundTexts = [
            [
                'text1' => 'Engineering curiosity meets hands-on craft to build resilient flying robots.',
                'text2' => 'Each prototype is a dialogue between biology, mechanics, and intuition.',
            ],
            [
                'text1' => 'Field experiments translate lab insights into reliable mission behavior.',
                'text2' => 'Tuning perching maneuvers requires hours on cliffs, trees, and hangars.',
            ],
            [
                'text1' => 'Collaboration with artists keeps the research grounded in human stories.',
                'text2' => 'Interactive installations reveal how people feel when technology senses them back.',
            ],
        ];

        foreach ($backgroundTexts as $text) {
            BackgroundText::create($text);
        }
    }
}
