<?php

namespace Database\Seeders;

use App\Models\Infromation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InfromationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $keys = [
            'simon_jeger',
            'liseagle_perching',
            'art_calder',
            'triamp',
            'balloon',
            'liseagle_morphing',
            'dipper',
            'art_parasit',
            'airflow',
            'tensegrity',
            'art_mit',
            'snowboarder'
        ];

        foreach ($keys as $key) {
            Infromation::updateOrCreate(
                ['key' => $key],
                [
                    'title' => str_replace('_', ' ', ucfirst($key)),
                    'description' => "This is the dynamic description for {$key} fetched from the database.",
                    'video' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy video link
                    'url_one' => 'https://google.com',
                    'url_two' => 'https://github.com',
                ]
            );
        }
    }
}
