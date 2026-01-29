<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserController;

Route::group(['as' => 'admin.', 'prefix' => 'admin', 'middleware' => ['auth']], function () {
    Route::get('dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('background-text', [AdminDashboardController::class, 'backgroundText'])->name('background_text');
    Route::patch('update/{key}', [AdminDashboardController::class, 'update'])->name('information.update');
    Route::post('background-text', [AdminDashboardController::class, 'backgroundTextUpdate'])->name('background_text.update');
    
});
