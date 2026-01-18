<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoController extends Controller
{
    public function stream(Request $request, string $filename)
    {
        $path = 'videos/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'Video not found');
        }

        $fullPath = Storage::disk('public')->path($path);
        $fileSize = filesize($fullPath);
        $mimeType = 'video/mp4';

        $range = $request->header('Range');

        // No range request - use BinaryFileResponse
        if (!$range) {
            $response = new BinaryFileResponse($fullPath);
            $response->headers->set('Content-Type', $mimeType);
            $response->headers->set('Accept-Ranges', 'bytes');
            return $response;
        }

        // Parse range header
        if (!preg_match('/bytes=(\d+)-(\d*)/', $range, $matches)) {
            abort(416, 'Invalid range');
        }

        $start = intval($matches[1]);
        $end = !empty($matches[2]) ? intval($matches[2]) : $fileSize - 1;

        // Ensure valid range
        if ($start >= $fileSize || $start < 0 || $end >= $fileSize) {
            abort(416, 'Range not satisfiable');
        }

        $end = min($end, $fileSize - 1);
        $length = $end - $start + 1;

        // Use StreamedResponse for range requests
        $stream = new StreamedResponse(function () use ($fullPath, $start, $length) {
            $file = fopen($fullPath, 'rb');
            if ($file === false) {
                return;
            }

            fseek($file, $start);

            $remaining = $length;
            while ($remaining > 0 && !feof($file)) {
                $chunkSize = min(8192, $remaining);
                $data = fread($file, $chunkSize);
                if ($data === false) {
                    break;
                }
                echo $data;
                $remaining -= strlen($data);
                flush();
            }

            fclose($file);
        }, 206);

        $stream->headers->set('Content-Type', $mimeType);
        $stream->headers->set('Content-Length', $length);
        $stream->headers->set('Content-Range', "bytes {$start}-{$end}/{$fileSize}");
        $stream->headers->set('Accept-Ranges', 'bytes');

        return $stream;
    }
}
