<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Frame;
use Inertia\Inertia;
use Inertia\Response;

class FrameViewController extends Controller
{
    public function show(): Response
    {
        $frame = Frame::with('elements')->where('is_active', true)->first();

        return Inertia::render('frontend/frame-viewer', [
            'frame' => $frame,
        ]);
    }
}
