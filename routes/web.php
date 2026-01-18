<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserDashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('admin/dashboard');
// })->name('dashboard');

Route::get('/test-video', function () {
    return view('test-video');
});

Route::get('/test-stream', function () {
    return response()->json([
        'route_works' => true,
        'video_route' => route('video.stream', ['filename' => 'demo.mp4']),
        'file_exists' => Storage::disk('public')->exists('videos/demo.mp4'),
        'file_path' => Storage::disk('public')->path('videos/demo.mp4'),
        'file_size' => Storage::disk('public')->exists('videos/demo.mp4')
            ? Storage::disk('public')->size('videos/demo.mp4')
            : 'not found',
    ]);
});

Route::get('/video-diagnostic', function () {
    $path = 'videos/demo.mp4';
    $fullPath = Storage::disk('public')->path($path);

    if (!file_exists($fullPath)) {
        return response()->json(['error' => 'File not found']);
    }

    $fileContents = file_get_contents($fullPath);
    $moovPosition = strpos($fileContents, 'moov');
    $ftypPosition = strpos($fileContents, 'ftyp');
    $fileSize = filesize($fullPath);

    return response()->json([
        'file_size' => $fileSize,
        'file_size_mb' => round($fileSize / 1024 / 1024, 2),
        'moov_position' => $moovPosition,
        'moov_percentage' => $moovPosition ? round(($moovPosition / $fileSize) * 100, 2) : null,
        'ftyp_position' => $ftypPosition,
        'is_web_optimized' => ($moovPosition !== false && $moovPosition < 50000),
        'problem' => ($moovPosition !== false && $moovPosition > 50000)
            ? 'Video metadata is at the END of file - browser must download entire file before seeking'
            : null,
        'solution' => 'Run: ffmpeg -i storage/app/public/videos/demo.mp4 -c copy -movflags +faststart storage/app/public/videos/demo_fixed.mp4'
    ]);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/frontend.php';
require __DIR__ . '/admin.php';
