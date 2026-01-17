<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\UserDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');

// Route::get('/dashboard', function () {
//     return Inertia::render('admin/dashboard');
// })->name('dashboard');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('user/dashboard', UserDashboardController::class)->name('user.dashboard');
});

Route::resource('todos', \App\Http\Controllers\TodoController::class)
    ->only(['index', 'store', 'update', 'destroy']);

require __DIR__ . '/settings.php';
require __DIR__ . '/frontend.php';
require __DIR__ . '/user.php';
require __DIR__ . '/admin.php';
