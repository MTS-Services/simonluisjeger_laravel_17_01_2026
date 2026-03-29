<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\BackgroundText;
use App\Models\Frame;
use App\Models\Information;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function home(): Response
    {
        $backgroundText = BackgroundText::first();

        return Inertia::render('frontend/home', [
            'projectData' => Information::all(),
            'backgroundText' => $backgroundText?->toArray(),
            'frame' => Frame::with('elements')
                ->where('is_active', true)
                ->orderBy('id')
                ->first(),
        ]);
    }
}
