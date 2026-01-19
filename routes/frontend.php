<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\FileUploadController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::group([], function () {
    Route::get('/', [HomeController::class, 'home'])->name('home');
    Route::get('/videos/{filename}', [VideoController::class, 'stream'])
        ->where('filename', '.*')
        ->name('video.stream');
    Route::resource('fileupload', FileUploadController::class);
});
