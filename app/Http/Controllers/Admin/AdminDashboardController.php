<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BackgroundText;
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
        $backgroundText = BackgroundText::first();

        return Inertia::render('admin/backgroundtext', [
            'information' => $backgroundText,
        ]);
    }

    public function backgroundTextUpdate(Request $request)
    {

        $validated = $request->validate([
            'text1' => 'required|string',
            'text2' => 'required|string',
        ]);

        $backgroundText = BackgroundText::first();
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
