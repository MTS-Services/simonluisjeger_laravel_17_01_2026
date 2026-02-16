<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Frame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FrameController extends Controller
{
    public function editor(Request $request): Response
    {
        $frame = Frame::with('elements')->first();

        if (! $frame) {
            $frame = Frame::create([
                'name' => 'Default Frame',
                'design_width' => 1200,
                'design_height' => 700,
            ]);
            $frame->load('elements');
        }

        return Inertia::render('admin/frame-editor', [
            'frame' => $frame,
        ]);
    }

    public function preview(): Response
    {
        $frame = Frame::with('elements')->first();

        return Inertia::render('admin/frame-preview', [
            'frame' => $frame,
        ]);
    }

    public function updateBackground(Request $request, Frame $frame)
    {
        $request->validate([
            'bg_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'base_svg' => 'nullable|file|mimes:svg|max:5120',
            'name' => 'nullable|string|max:255',
            'design_width' => 'nullable|integer|min:100|max:5000',
            'design_height' => 'nullable|integer|min:100|max:5000',
        ]);

        $updateData = [];

        if ($request->filled('name')) {
            $updateData['name'] = $request->input('name');
        }

        if ($request->filled('design_width')) {
            $updateData['design_width'] = (int) $request->input('design_width');
        }

        if ($request->filled('design_height')) {
            $updateData['design_height'] = (int) $request->input('design_height');
        }

        if ($request->hasFile('bg_image')) {
            if ($frame->bg_image) {
                Storage::disk('public')->delete($frame->bg_image);
            }
            $updateData['bg_image'] = $request->file('bg_image')->store('frames/backgrounds', 'public');
        }

        if ($request->hasFile('base_svg')) {
            if ($frame->base_svg) {
                Storage::disk('public')->delete($frame->base_svg);
            }
            $updateData['base_svg'] = $request->file('base_svg')->store('frames/svgs', 'public');
        }

        if (! empty($updateData)) {
            $frame->update($updateData);
        }

        // Refresh so redirect response can include updated frame if needed
        $frame->refresh();
        $frame->load('elements');

        return redirect()->back()->with('message', 'Frame background updated.');
    }

    public function updateLayout(Request $request, Frame $frame)
    {
        $validated = $request->validate([
            'elements' => 'required|array',
            'elements.*.id' => 'required|integer|exists:frame_elements,id',
            'elements.*.x_pct' => 'required|numeric|min:0|max:100',
            'elements.*.y_pct' => 'required|numeric|min:0|max:100',
            'elements.*.w_pct' => 'required|numeric|min:0.1|max:100',
            'elements.*.h_pct' => 'required|numeric|min:0.1|max:100',
            'elements.*.z_index' => 'required|integer|min:0|max:9999',
        ]);

        foreach ($validated['elements'] as $elementData) {
            $frame->elements()->where('id', $elementData['id'])->update([
                'x_pct' => $elementData['x_pct'],
                'y_pct' => $elementData['y_pct'],
                'w_pct' => $elementData['w_pct'],
                'h_pct' => $elementData['h_pct'],
                'z_index' => $elementData['z_index'],
            ]);
        }

        return redirect()->back()->with('message', 'Layout saved successfully.');
    }
}
