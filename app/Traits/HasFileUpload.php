<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait HasFileUpload
{
    /**
     * Upload a single file
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string $disk
     * @return array
     */
    public function uploadFile(UploadedFile $file, string $directory = 'uploads', string $disk = 'public'): array
    {
        $filename = $this->generateUniqueFilename($file);
        $path = $file->storeAs($directory, $filename, $disk);

        return [
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
        ];
    }

    /**
     * Upload multiple files
     *
     * @param array $files
     * @param string $directory
     * @param string $disk
     * @return array
     */
    public function uploadMultipleFiles(array $files, string $directory = 'uploads', string $disk = 'public'): array
    {
        $uploadedFiles = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $uploadedFiles[] = $this->uploadFile($file, $directory, $disk);
            }
        }

        return $uploadedFiles;
    }

    /**
     * Delete a file
     *
     * @param string|null $path
     * @param string $disk
     * @return bool
     */
    public function deleteFile(?string $path, string $disk = 'public'): bool
    {
        if (!$path) {
            return false;
        }

        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    /**
     * Delete multiple files
     *
     * @param array $paths
     * @param string $disk
     * @return bool
     */
    public function deleteMultipleFiles(array $paths, string $disk = 'public'): bool
    {
        $paths = array_filter($paths); // Remove null values

        if (empty($paths)) {
            return false;
        }

        return Storage::disk($disk)->delete($paths);
    }

    /**
     * Check if file exists
     *
     * @param string|null $path
     * @param string $disk
     * @return bool
     */
    public function fileExists(?string $path, string $disk = 'public'): bool
    {
        if (!$path) {
            return false;
        }

        return Storage::disk($disk)->exists($path);
    }

    /**
     * Get file URL
     *
     * @param string|null $path
     * @param string $disk
     * @return string|null
     */
    public function getFileUrl(?string $path, string $disk = 'public'): ?string
    {
        if (!$path) {
            return null;
        }

        if (!$this->fileExists($path, $disk)) {
            return null;
        }

        return Storage::disk($disk)->url($path);
    }

    /**
     * Get file size
     *
     * @param string|null $path
     * @param string $disk
     * @return int
     */
    public function getFileSize(?string $path, string $disk = 'public'): int
    {
        if (!$path || !$this->fileExists($path, $disk)) {
            return 0;
        }

        return Storage::disk($disk)->size($path);
    }

    /**
     * Get file mime type
     *
     * @param string|null $path
     * @param string $disk
     * @return string|null
     */
    public function getFileMimeType(?string $path, string $disk = 'public'): ?string
    {
        if (!$path || !$this->fileExists($path, $disk)) {
            return null;
        }

        return Storage::disk($disk)->mimeType($path);
    }

    /**
     * Replace existing file with new one
     *
     * @param UploadedFile $newFile
     * @param string|null $oldPath
     * @param string $directory
     * @param string $disk
     * @return array
     */
    public function replaceFile(UploadedFile $newFile, ?string $oldPath, string $directory = 'uploads', string $disk = 'public'): array
    {
        // Delete old file if exists
        if ($oldPath) {
            $this->deleteFile($oldPath, $disk);
        }

        // Upload new file
        return $this->uploadFile($newFile, $directory, $disk);
    }

    /**
     * Generate unique filename
     *
     * @param UploadedFile $file
     * @return string
     */
    protected function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = Str::slug($filename);

        return $filename . '_' . time() . '_' . Str::random(8) . '.' . $extension;
    }

    /**
     * Get file details as array
     *
     * @param string|null $path
     * @param string $disk
     * @return array
     */
    public function getFileDetails(?string $path, string $disk = 'public'): array
    {
        if (!$path) {
            return [
                'path' => null,
                'url' => null,
                'name' => 'Unknown',
                'size' => 0,
                'mime_type' => null,
                'exists' => false,
            ];
        }

        $exists = $this->fileExists($path, $disk);

        return [
            'path' => $path,
            'url' => $exists ? $this->getFileUrl($path, $disk) : null,
            'name' => basename($path),
            'size' => $exists ? $this->getFileSize($path, $disk) : 0,
            'mime_type' => $exists ? $this->getFileMimeType($path, $disk) : null,
            'exists' => $exists,
        ];
    }

    /**
     * Copy file to new location
     *
     * @param string $sourcePath
     * @param string $destinationPath
     * @param string $disk
     * @return bool
     */
    public function copyFile(string $sourcePath, string $destinationPath, string $disk = 'public'): bool
    {
        if (!$this->fileExists($sourcePath, $disk)) {
            return false;
        }

        return Storage::disk($disk)->copy($sourcePath, $destinationPath);
    }

    /**
     * Move file to new location
     *
     * @param string $sourcePath
     * @param string $destinationPath
     * @param string $disk
     * @return bool
     */
    public function moveFile(string $sourcePath, string $destinationPath, string $disk = 'public'): bool
    {
        if (!$this->fileExists($sourcePath, $disk)) {
            return false;
        }

        return Storage::disk($disk)->move($sourcePath, $destinationPath);
    }
}
