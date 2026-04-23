<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Google Site Verification --}}
    <meta name="google-site-verification" content="MQAmcdPGR948LYOxVln9pLINL3l4CJhE1Es6ROH2vZQ" />

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    @verbatim
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": "https://www.simonjeger.ch/#website",
                    "url": "https://www.simonjeger.ch/",
                    "name": "Robotics Art Research & Creative Projects | Simon Jeger",
                    "description": "Robotics Art by Simon Jeger | Explore innovative robotics and art projects combining AI, autonomous systems, and creative technology at EPFL research.",
                    "publisher": {
                        "@id": "https://www.simonjeger.ch/#person"
                    },
                    "inLanguage": "en"
                },
                {
                    "@type": "Person",
                    "@id": "https://www.simonjeger.ch/#person",
                    "name": "Simon Jeger",
                    "url": "https://www.simonjeger.ch/",
                    "description": "Robotics researcher and creative technologist working at the intersection of robotics, AI, and art.",
                    "jobTitle": "Robotics Researcher",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Lausanne",
                        "postalCode": "1015",
                        "addressCountry": "CH"
                    },
                    "affiliation": {
                        "@type": "Organization",
                        "name": "EPFL",
                        "url": "https://www.epfl.ch/"
                    },
                    "knowsAbout": [
                        "Robotics",
                        "Robotics Art",
                        "Reinforcement Learning",
                        "Autonomous Systems",
                        "Drone Navigation",
                        "Aerial Robotics",
                        "Artificial Intelligence",
                        "Control Systems"
                    ],
                    "sameAs": [
                        "https://scholar.google.com/citations?user=OGc_xMIAAAAJ",
                        "https://www.epfl.ch/",
                        "https://lis.epfl.ch/"
                    ]
                }
            ]
        }
    </script>
    @endverbatim



    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name') }}</title>

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
