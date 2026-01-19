<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\FileUpload;
use App\Traits\HasFileUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FileUploadController extends Controller
{
    use HasFileUpload;

    /**
     * Display a listing of all file uploads.
     */
    public function index(): Response
    {
        $fileUploads = FileUpload::latest()->get()->map(function ($file) {
            $fileDetails = $this->getFileDetails($file->path);

            return [
                'id' => $file->id,
                'path' => $file->path,
                'mime_type' => $file->mime_type,
                'url' => $fileDetails['url'],
                'name' => $fileDetails['name'],
                'size' => $fileDetails['size'],
                'created_at' => $file->created_at,
                'updated_at' => $file->updated_at,
            ];
        });

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
        // Handle both single file and multiple files
        $validated = $request->validate([
            'file' => 'nullable|file|max:10240', // 10MB max
            'files' => 'nullable|array',
            'files.*' => 'file|max:10240', // 10MB max per file
        ]);

        $uploadedFiles = [];

        // Handle single file upload
        if ($request->hasFile('file')) {
            $fileData = $this->uploadFile($request->file('file'));

            $uploadedFiles[] = FileUpload::create([
                'path' => $fileData['path'],
                'mime_type' => $fileData['mime_type'],
            ]);
        }

        // Handle multiple files upload
        if ($request->hasFile('files')) {
            $filesData = $this->uploadMultipleFiles($request->file('files'));

            foreach ($filesData as $fileData) {
                $uploadedFiles[] = FileUpload::create([
                    'path' => $fileData['path'],
                    'mime_type' => $fileData['mime_type'],
                ]);
            }
        }

        if (empty($uploadedFiles)) {
            return back()->withErrors(['file' => 'No file was uploaded.']);
        }

        $message = count($uploadedFiles) > 1
            ? count($uploadedFiles) . ' files uploaded successfully'
            : 'File uploaded successfully';

        return redirect()->route('fileupload.index')->with('success', $message);
    }

    /**
     * Display the specified file upload.
     */
    public function show(FileUpload $fileupload): Response
    {
        $fileDetails = $this->getFileDetails($fileupload->path);

        $fileData = [
            'id' => $fileupload->id,
            'path' => $fileupload->path,
            'mime_type' => $fileupload->mime_type,
            'url' => $fileDetails['url'],
            'name' => $fileDetails['name'],
            'size' => $fileDetails['size'],
            'created_at' => $fileupload->created_at,
            'updated_at' => $fileupload->updated_at,
        ];

        return Inertia::render('FileUpload/Show', [
            'fileUpload' => $fileData,
        ]);
    }

    /**
     * Show the form for editing the specified file upload.
     */
    public function edit(FileUpload $fileupload): Response
    {
        $fileDetails = $this->getFileDetails($fileupload->path);

        $fileData = [
            'id' => $fileupload->id,
            'path' => $fileupload->path,
            'mime_type' => $fileupload->mime_type,
            'url' => $fileDetails['url'],
            'name' => $fileDetails['name'],
            'size' => $fileDetails['size'],
            'created_at' => $fileupload->created_at,
            'updated_at' => $fileupload->updated_at,
        ];

        return Inertia::render('FileUpload/Edit', [
            'fileUpload' => $fileData,
        ]);
    }

    /**
     * Update the specified file upload in storage.
     */
    public function update(Request $request, FileUpload $fileupload)
    {
        $validated = $request->validate([
            'file' => 'nullable|file|max:10240', // 10MB max
        ]);

        // If a new file is uploaded, replace the old one
        if ($request->hasFile('file')) {
            $fileData = $this->replaceFile(
                $request->file('file'),
                $fileupload->path
            );

            $fileupload->update([
                'path' => $fileData['path'],
                'mime_type' => $fileData['mime_type'],
            ]);

            return redirect()
                ->route('fileupload.show', $fileupload)
                ->with('success', 'File updated successfully');
        }

        return redirect()
            ->route('fileupload.show', $fileupload)
            ->with('info', 'No changes were made');
    }

    /**
     * Remove the specified file upload from storage.
     */
    public function destroy(FileUpload $fileupload)
    {
        // Delete file from storage
        $this->deleteFile($fileupload->path);

        // Delete database record
        $fileupload->delete();

        return redirect()
            ->route('fileupload.index')
            ->with('success', 'File deleted successfully');
    }
}
