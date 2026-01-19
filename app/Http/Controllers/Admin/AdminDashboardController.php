<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Information;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $key = $request->query('key');
        $information = $key ? Information::where('key', $key)->first() : null;

        return Inertia::render('admin/dashboard', [
            'information' => $information,
            'currentKey' => $key,
        ]);
    }

    public function update(Request $request, string $key)
    {
        $information = Information::where('key', $key)->firstOrFail();

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'date'        => 'nullable|string|max:100',
            'video'       => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-m4v|mimes:mp4,mov,m4v|max:512000',
            'urls'        => 'nullable|array',
        ]);

        // Remove video from validated array to prevent null overwrite
        unset($validated['video']);

        // Only process video if a new file is uploaded
        if ($request->hasFile('video')) {
            // Delete old video if exists
            if ($information->video) {
                Storage::disk('public')->delete($information->video);
            }

            // Store new video
            $path = $request->file('video')->store('projects/videos', 'public');
            $validated['video'] = $path;
        }

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
