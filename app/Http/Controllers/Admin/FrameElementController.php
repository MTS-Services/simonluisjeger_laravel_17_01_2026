<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Frame;
use App\Models\FrameElement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FrameElementController extends Controller
{
    public function store(Request $request, Frame $frame)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'overlay_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'media_type' => 'nullable|in:image,video',
            'media_file' => 'nullable|file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-m4v|max:512000',
        ]);

        $overlayPath = $request->file('overlay_image')->store('frames/elements', 'public');

        $mediaUrl = null;
        $mediaType = $validated['media_type'] ?? null;

        if ($request->hasFile('media_file')) {
            $mediaFile = $request->file('media_file');
            $mime = $mediaFile->getMimeType();

            if (str_starts_with($mime, 'video/')) {
                $mediaType = 'video';
                $mediaUrl = $mediaFile->store('frames/media', 'public');
            } else {
                $mediaType = 'image';
                $mediaUrl = $mediaFile->store('frames/media', 'public');
            }
        }

        $maxSort = $frame->elements()->max('sort_order') ?? 0;

        $frame->elements()->create([
            'name' => $validated['name'],
            'overlay_image' => $overlayPath,
            'title' => $validated['title'] ?? $validated['name'],
            'description' => $validated['description'] ?? '',
            'media_type' => $mediaType,
            'media_url' => $mediaUrl,
            'x_pct' => 10,
            'y_pct' => 10,
            'w_pct' => 10,
            'h_pct' => 10,
            'z_index' => 1,
            'sort_order' => $maxSort + 1,
        ]);

        return redirect()->back()->with('message', 'Element added successfully.');
    }

    public function update(Request $request, FrameElement $element)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'overlay_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:10240',
            'media_type' => 'nullable|in:image,video',
            'media_file' => 'nullable|file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-m4v|max:512000',
            'z_index' => 'nullable|integer|min:0|max:9999',
        ]);

        if ($request->hasFile('overlay_image')) {
            Storage::disk('public')->delete($element->overlay_image);
            $validated['overlay_image'] = $request->file('overlay_image')->store('frames/elements', 'public');
        } else {
            unset($validated['overlay_image']);
        }

        if ($request->hasFile('media_file')) {
            if ($element->media_url) {
                Storage::disk('public')->delete($element->media_url);
            }

            $mediaFile = $request->file('media_file');
            $mime = $mediaFile->getMimeType();

            if (str_starts_with($mime, 'video/')) {
                $validated['media_type'] = 'video';
                $validated['media_url'] = $mediaFile->store('frames/media', 'public');
            } else {
                $validated['media_type'] = 'image';
                $validated['media_url'] = $mediaFile->store('frames/media', 'public');
            }
        }

        unset($validated['media_file']);

        $element->update($validated);

        return redirect()->back()->with('message', 'Element updated successfully.');
    }

    public function destroy(FrameElement $element)
    {
        Storage::disk('public')->delete($element->overlay_image);

        if ($element->media_url) {
            Storage::disk('public')->delete($element->media_url);
        }

        $element->delete();

        return redirect()->back()->with('message', 'Element deleted successfully.');
    }
}
