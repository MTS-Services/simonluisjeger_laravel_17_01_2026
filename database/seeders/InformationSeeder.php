<?php

namespace Database\Seeders;

use App\Models\Information;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $informations = [
            [
                'key' => 'simon_jeger',
                'title' => 'Simon Jeger',
                'description' => "Outside of research I snowboard, travel and pet all animals I come across.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Google Scholar',
                        'url' => 'https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=OGc_xMIAAAAJ',
                    ],
                    [
                        'label' => 'Orcid',
                        'url' => 'https://orcid.org/0000-0003-3824-5612',
                    ],
                    [
                        'label' => 'LinkedIn',
                        'url' => 'https://www.linkedin.com/in/simon-jeger-714a8a14b/',
                    ],
                    [
                        'label' => 'Email',
                        'url' => 'simon.jeger@epfl.ch',
                        'type' => 'email',
                    ]
                ],
                'date' => '12.1994',
            ],
            [
                'key' => 'liseagle_perching',
                'title' => 'LisEagle perching',
                'description' => "Replicating and explaining agile perching maneuvers in birds using an avian inspired drone.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Publication',
                        'url' => 'https://doi.org/10.1038/s41467-024-52369-4',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/Mv3I3Bv8UyQ?si=CyzpbHUqiUbLqfHt',
                    ]
                ],
                'date' => '09.2024',
            ],
            [
                'key' => 'art_calder',
                'title' => 'Artwork with N-04008',
                'description' => "Piece with Sarah Oppenheimer that invites communication through a tactile, luminous network.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Website',
                        'url' => 'https://en.atelier-calder.com/sarah-oppenheimer'
                    ],
                ],
                'date' => '12.2024',
            ],
            [
                'key' => 'triamp',
                'title' => 'Triamp',
                'description' => "Conversion of three vintage cars to fully electric vehicles.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Website',
                        'url' => 'https://www.triamp.ch/',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://drive.google.com/file/d/1KF4Rgtsp2JKYYPwE6EW80uIZKDtEIrNV/view?usp=drive_link',
                    ]
                ],
                'date' => '09.2018 - 09.2024',
            ],
            [
                'key' => 'balloon',
                'title' => 'Autonomous Balloon',
                'description' => "Reinforcement learning leverages wind for outdoor balloon navigation.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Publication',
                        'url' => 'https://doi.org/10.1109/mra.2023.3271203',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/NxpNbGzozRk?si=-Pp88vzLSG23KlZX',
                    ]
                ],
                'date' => '06.2024',
            ],
            [
                'key' => 'tensegrity',
                'title' => 'Tensegrity Drone',
                'description' => "Collision-resilient winged drones enabled by tensegrity structures",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Publication',
                        'url' => 'https://doi.org/10.1002/adrr.202500050',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/kyvZJ6cJJGg?si=gcO2lB5l7uwOW8K8',
                    ]
                ],
                'date' => '08.2025',
            ],
            [
                'key' => 'liseagle_morphing',
                'title' => 'LisEagle morphing',
                'description' => "Adaptive morphing of wing and tail for stable, resilient, and energy-efficient flight of avian-inspired drone.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Publication',
                        'url' => 'https://doi.org/10.1038/s44182-024-00015-y',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/5n8Mlsi7tFk?si=o7Lp9DUHhzlH_qK1',
                    ]
                ],
                'date' => '11.2024',
            ],
            [
                'key' => 'dipper',
                'title' => 'Dipper',
                'description' => "An aerial aquatic uncrewed vehicle, capable of flying, diving, and transitioning between the two media.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Publication',
                        'url' => 'https://doi.org/10.15607/rss.2021.xvii.048',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/KV90qqnhHb0?si=Gf0tRhDYHn_6yMjg',
                    ]
                ],
                'date' => '07.2021',
            ],
            [
                'key' => 'art_parasit',
                'title' => 'Artwork Parasit',
                'description' => "Connecting existing park benches and translating touch into sound.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Website',
                        'url' => 'https://www.designbiennalezurich.ch/ausstellung-2025/parasit',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/jK8ywYUHzMw?si=Vk0QJ70mZ168sIew',
                    ]
                ],
                'date' => '09.2025',
            ],
            [
                'key' => 'airflow',
                'title' => 'Airflow Sensor',
                'description' => "Lightweight sensor that measures airspeed, angle of attack and angle of side slip.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Publication',
                        'url' => 'https://doi.org/10.1109/lra.2025.3604704',
                    ],
                    [
                        'label' => 'Video',
                        'url' => 'https://youtu.be/3thvbw9Kfnk?si=baJtPAAgv6FFGuv9',
                    ]
                ],
                'date' => '10.2025',
            ],
            [
                'key' => 'art_mit',
                'title' => 'Artwork N-05001',
                'description' => "Permanent Piece with Sarah Oppenheimer for MIT’s Metropolitan Warehouse that reacts to its surroundings",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Website',
                        'url' => 'https://listart.mit.edu/art-artists/sarah-oppenheimer-selected-art-commission-mit-2026',
                    ],
                    [
                        'label' => 'Workshop',
                        'url' => 'https://sap.mit.edu/news/programming-agency-three-day-workshop-sarah-oppenheimer',
                    ]
                ],
                'date' => '03.2026',
            ],
            [
                'key' => 'snowboarder',
                'title' => 'Simon Jeger',
                'description' => "Outside of research I snowboard, travel and pet all animals I come across.",
                'video' => 'videos/demo.mp4', // Dummy video link
                'urls' => [
                    [
                        'label' => 'Google Scholar',
                        'url' => 'https://scholar.google.com/citations?view_op=list_works&hl=en&hl=en&user=OGc_xMIAAAAJ',
                    ],
                    [
                        'label' => 'Orcid',
                        'url' => 'https://orcid.org/0000-0003-3824-5612',
                    ],
                    [
                        'label' => 'LinkedIn',
                        'url' => 'https://www.linkedin.com/in/simon-jeger-714a8a14b/',
                    ],
                    [
                        'label' => 'Email',
                        'url' => 'simon.jeger@epfl.ch',
                        'type' => 'email',
                    ]
                ],
                'date' => '12.1994',
            ],
        ];

        foreach ($informations as $information) {
            Information::create($information);
        }
    }
}
