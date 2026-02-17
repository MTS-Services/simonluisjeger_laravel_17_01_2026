<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\FrameController;
use App\Http\Controllers\Admin\FrameElementController;
use App\Http\Controllers\Admin\UserController;

Route::group(['as' => 'admin.', 'prefix' => 'admin', 'middleware' => ['auth', 'admin']], function () {
    Route::get('dashboard', [AdminDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('background-text', [AdminDashboardController::class, 'backgroundText'])->name('background_text');
    Route::patch('update/{key}', [AdminDashboardController::class, 'update'])->name('information.update');
    Route::post('background-text', [AdminDashboardController::class, 'backgroundTextUpdate'])->name('background_text.update');

    // Frame editor
    Route::get('frame-editor', [FrameController::class, 'editor'])->name('frame.editor');
    Route::get('frame-preview', [FrameController::class, 'preview'])->name('frame.preview');
    Route::post('frames/{frame}/background', [FrameController::class, 'updateBackground'])->name('frame.background');
    Route::put('frames/{frame}/layout', [FrameController::class, 'updateLayout'])->name('frame.layout');

    // Frame elements CRUD
    Route::post('frames/{frame}/elements', [FrameElementController::class, 'store'])->name('frame.elements.store');
    Route::post('frame-elements/{element}', [FrameElementController::class, 'update'])->name('frame.elements.update');
    Route::delete('frame-elements/{element}', [FrameElementController::class, 'destroy'])->name('frame.elements.destroy');
});
