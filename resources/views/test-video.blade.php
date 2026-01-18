<!DOCTYPE html>
<html>

<head>
    <title>Video Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        video {
            margin: 20px 0;
            border: 2px solid #ccc;
        }

        .info {
            background: #f0f0f0;
            padding: 10px;
            margin: 10px 0;
        }
    </style>
</head>

<body>
    <h1>Video Streaming Test</h1>

    <div class="info">
        <strong>Route URL:</strong> {{ route('video.stream', ['filename' => 'demo.mp4']) }}
    </div>

    <h2>Test 1: Local Video (Through Controller)</h2>
    <video controls width="640" height="360" preload="metadata" id="video1">
        <source src="{{ route('video.stream', ['filename' => 'demo.mp4']) }}" type="video/mp4">
    </video>

    <h2>Test 2: External Video (should work)</h2>
    <video controls width="640" height="360" preload="metadata" id="video2">
        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4">
    </video>

    <h2>Debug Info</h2>
    <div id="debug" style="background: #f9f9f9; padding: 15px; border: 1px solid #ddd;"></div>

    <script>
        const debugDiv = document.getElementById('debug');

        function log(message) {
            console.log(message);
            debugDiv.innerHTML += message + '<br>';
        }

        // Log all network requests
        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            const name = index === 0 ? 'Local Video' : 'External Video';

            video.addEventListener('loadstart', () => {
                log(`${name}: Load started`);
                log(`${name}: Source URL = ${video.querySelector('source').src}`);
            });

            video.addEventListener('loadedmetadata', () => {
                log(`${name}: Metadata loaded, duration: ${video.duration.toFixed(2)}s`);
            });

            video.addEventListener('seeking', () => {
                log(`${name}: Seeking to ${video.currentTime.toFixed(2)}s`);
            });

            video.addEventListener('seeked', () => {
                log(`${name}: Seeked successfully to ${video.currentTime.toFixed(2)}s`);
            });

            video.addEventListener('error', (e) => {
                log(`${name}: ERROR - ${e.message || 'Unknown error'}`);
                console.error(`${name} error:`, e);
            });
        });

        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            log(`Fetch request: ${args[0]}`);
            return originalFetch.apply(this, args);
        };
    </script>
</body>

</html>
