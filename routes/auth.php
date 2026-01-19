<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login', function () {
    if (auth()->check()) {
        return redirect(route('admin.dashboard'));
    }
    return Inertia::render('auth/login');
})->name('login');
