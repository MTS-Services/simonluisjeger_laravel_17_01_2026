<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BackgroundText;
use App\Models\Frame;
use App\Models\FrameElement;
use App\Models\Information;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        // $key = $request->query('key');
        // $information = null;
        // if ($key == 'background_text') {
        //     $information = BackgroundText::first();
        // } else {
        //     $information = $key ? Information::where('key', $key)->first() : null;
        // }

        // return Inertia::render('admin/dashboard', [
        //     'information' => $information,
        //     'currentKey' => $key,
        // ]);

        return redirect()->route('admin.frame.editor');
    }

    public function backgroundText(Request $request)
    {
        $backgroundText = BackgroundText::query()->first();
        $activeFrame = Frame::with('elements')
            ->where('is_active', true)
            ->orderBy('id')
            ->first();

        return Inertia::render('admin/backgroundtext', [
            'information' => $backgroundText,
            'frame' => $activeFrame,
            'projectPreview' => Information::query()
                ->orderBy('id')
                ->get(['key', 'title'])
                ->map(fn (Information $row) => [
                    'key' => (string) $row->key,
                    'title' => (string) $row->title,
                ])
                ->values()
                ->all(),
        ]);
    }

    public function backgroundTextUpdate(Request $request)
    {

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'text1' => 'required|string',
            'text2' => 'required|string',
            'background_color' => 'required|string|max:7',
            'text_color' => 'required|string|max:7',
            'text1_link_element_name' => 'nullable|string|max:100',
            'text1_link_frame_element_id' => 'nullable|integer|exists:frame_elements,id',
            'text1_link_color' => 'nullable|string|max:7',
            'text1_link_hover_color' => 'nullable|string|max:7',
            'text1_link_underline' => 'sometimes|boolean',
        ]);

        $validated['text1_link_word'] = null;
        if (array_key_exists('text1_link_hover_color', $validated)) {
            $hover = trim((string) ($validated['text1_link_hover_color'] ?? ''));
            $validated['text1_link_hover_color'] = $hover !== '' ? $hover : null;
        }

        $payload = $request->all();
        if (array_key_exists('text1_link_frame_element_id', $payload)) {
            $raw = $payload['text1_link_frame_element_id'];
            if ($raw === '' || $raw === null) {
                $validated['text1_link_frame_element_id'] = null;
            } else {
                $validated['text1_link_frame_element_id'] = (int) $raw;
            }
        }

        $eid = $validated['text1_link_frame_element_id'] ?? null;
        if ($eid) {
            $belongs = FrameElement::query()
                ->where('id', $eid)
                ->whereHas('frame', fn ($q) => $q->where('is_active', true))
                ->exists();
            if (! $belongs) {
                $validated['text1_link_frame_element_id'] = null;
            }
        }

        $backgroundText = BackgroundText::query()->first();
        if (! $backgroundText) {
            $backgroundText = BackgroundText::create($validated);
        } else {
            $backgroundText->update($validated);
        }

        return redirect()->back()->with('message', 'Background text updated successfully!');
    }

    public function update(Request $request, string $key)
    {
        $information = Information::where('key', $key)->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'nullable|string|max:100',
            'file' => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-m4v,image/jpeg,image/png,image/gif|max:512000',
            'urls' => 'nullable|array',
        ]);

        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($information->file_path) {
                Storage::disk('public')->delete($information->file_path);
            }

            // Store new file
            $path = $request->file('file')->store('projects/files', 'public');
            $validated['file_path'] = $path;
            $validated['mime_type'] = $request->file('file')->getMimeType();
        }

        // Remove file from validated array to prevent errors
        unset($validated['file']);

        // Update the information record
        $information->update($validated);

        // IMPORTANT: Reload the fresh data to send back to frontend
        $information->refresh();

        // Return with the updated information
        return redirect()->back()->with([
            'message' => 'Project updated successfully!',
            // Optionally, you can pass the updated information back
            // but Inertia should automatically refresh the page props
        ]);
    }
}
