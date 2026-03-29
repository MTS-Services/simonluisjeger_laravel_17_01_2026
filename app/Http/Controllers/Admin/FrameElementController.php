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
            'overlay_image' => 'nullable|file|mimetypes:image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml|max:10240',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'media_type' => 'nullable|in:image,video',
            'media_file' => 'nullable|file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-m4v|max:512000',
            'rotation' => 'nullable|numeric|min:-360|max:360',
            'hover_color' => ['nullable', 'string', 'max:9', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/'],
            'active_color' => ['nullable', 'string', 'max:9', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/'],
            'links' => 'nullable|array|max:10',
            'links.*.label' => 'nullable|string|max:255',
            'links.*.type' => 'nullable|in:external,internal',
            'links.*.url' => 'nullable|string|max:2048',
            'links.*.target_element_id' => 'nullable|integer',
        ]);

        $overlayPath = $request->hasFile('overlay_image')
            ? $request->file('overlay_image')->store('frames/elements', 'public')
            : null;

        $links = $this->sanitizeLinks($validated['links'] ?? [], $frame->id, null);

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
            'rotation' => $validated['rotation'] ?? 0,
            'hover_color' => $validated['hover_color'] ?? null,
            'active_color' => $validated['active_color'] ?? null,
            'links' => empty($links) ? null : $links,
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
            'overlay_image' => 'nullable|file|mimetypes:image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml|max:10240',
            'media_type' => 'nullable|in:image,video',
            'media_file' => 'nullable|file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-m4v|max:512000',
            'z_index' => 'nullable|integer|min:0|max:9999',
            'rotation' => 'nullable|numeric|min:-360|max:360',
            'hover_color' => ['nullable', 'string', 'max:9', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/'],
            'active_color' => ['nullable', 'string', 'max:9', 'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/'],
            'links' => 'nullable|array|max:10',
            'links.*.label' => 'nullable|string|max:255',
            'links.*.type' => 'nullable|in:external,internal',
            'links.*.url' => 'nullable|string|max:2048',
            'links.*.target_element_id' => 'nullable|integer',
        ]);

        $links = $this->sanitizeLinks($validated['links'] ?? [], $element->frame_id, $element->id);

        if ($request->hasFile('overlay_image')) {
            Storage::disk('public')->delete($element->overlay_image);
            $validated['overlay_image'] = $request->file('overlay_image')->store('frames/elements', 'public');
        } else {
            unset($validated['overlay_image']);
        }

        $validated['links'] = empty($links) ? null : $links;

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

        if (isset($validated['rotation'])) {
            $validated['rotation'] = (float) $validated['rotation'];
        }

        $element->update($validated);

        return redirect()->back()->with('message', 'Element updated successfully.');
    }

    /**
     * @param  array<int, array<string, mixed>>  $links
     * @return array<int, array<string, mixed>>
     */
    protected function sanitizeLinks(array $links, int $frameId, ?int $excludeElementId): array
    {
        $out = [];

        foreach ($links as $link) {
            $label = trim((string) ($link['label'] ?? ''));
            if ($label === '') {
                continue;
            }

            $type = $link['type'] ?? 'external';
            if ($type !== 'internal') {
                $type = 'external';
            }

            if ($type === 'internal') {
                $tid = isset($link['target_element_id']) ? (int) $link['target_element_id'] : 0;
                if ($tid <= 0) {
                    continue;
                }
                if ($excludeElementId !== null && $tid === $excludeElementId) {
                    continue;
                }
                $exists = FrameElement::query()
                    ->where('id', $tid)
                    ->where('frame_id', $frameId)
                    ->exists();
                if (! $exists) {
                    continue;
                }
                $out[] = [
                    'label' => $label,
                    'type' => 'internal',
                    'target_element_id' => $tid,
                ];

                continue;
            }

            $url = trim((string) ($link['url'] ?? ''));
            if ($url === '' || filter_var($url, FILTER_VALIDATE_URL) === false) {
                continue;
            }

            $out[] = [
                'label' => $label,
                'type' => 'external',
                'url' => $url,
            ];
        }

        return collect($out)->take(10)->values()->all();
    }

    public function destroy(FrameElement $element)
    {
        if ($element->overlay_image) {
            Storage::disk('public')->delete($element->overlay_image);
        }

        if ($element->media_url) {
            Storage::disk('public')->delete($element->media_url);
        }

        $element->delete();

        return redirect()->back()->with('message', 'Element deleted successfully.');
    }
}
