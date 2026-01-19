<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\FileUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FileUploadController extends Controller
{
    /**
     * Display a listing of all file uploads.
     */
    public function index(): Response
    {
        $fileUploads = FileUpload::all();

        return Inertia::render('FileUpload/Index', [
            'fileUploads' => $fileUploads,
        ]);
    }

    /**
     * Show the form for creating a new file upload.
     */
    public function create(): Response
    {
        return Inertia::render('FileUpload/Create');
    }

    /**
     * Store a newly created file upload in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => 'required|file',
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads');
        $mimeType = $file->getMimeType();

        FileUpload::create([
            'path' => $path,
            'mime_type' => $mimeType,
        ]);

        return redirect()->route('fileupload.index')->with('success', 'File uploaded successfully');
    }

    /**
     * Display the specified file upload.
     */
    public function show(FileUpload $fileUpload): Response
    {
        return Inertia::render('FileUpload/Show', [
            'fileUpload' => $fileUpload,
        ]);
    }

    /**
     * Show the form for editing the specified file upload.
     */
    public function edit(FileUpload $fileUpload): Response
    {
        return Inertia::render('FileUpload/Edit', [
            'fileUpload' => $fileUpload,
        ]);
    }

    /**
     * Update the specified file upload in storage.
     */
    public function update(Request $request, FileUpload $fileUpload)
    {
        $validated = $request->validate([
            'mime_type' => 'required|string',
        ]);

        $fileUpload->update($validated);

        return redirect()->route('fileupload.show', $fileUpload)->with('success', 'File updated successfully');
    }

    /**
     * Remove the specified file upload from storage.
     */
    public function destroy(FileUpload $fileUpload)
    {
        \Illuminate\Support\Facades\Storage::delete($fileUpload->path);
        $fileUpload->delete();

        return redirect()->route('fileupload.index')->with('success', 'File deleted successfully');
    }
}
