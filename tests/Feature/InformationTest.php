<?php

namespace Tests\Feature;

use App\Models\Information;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InformationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_upload_image_for_information()
    {
        Storage::fake('public');

        $admin = User::factory()->create(['is_admin' => true]);
        $information = Information::factory()->create();

        $file = UploadedFile::fake()->image('project.jpg');

        $response = $this->actingAs($admin)->patch(route('admin.information.update', $information->key), [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'file' => $file,
        ]);

        $response->assertRedirect();
        $information->refresh();

        $this->assertNotNull($information->file_path);
        $this->assertEquals('image/jpeg', $information->mime_type);
        Storage::disk('public')->assertExists($information->file_path);
    }

    public function test_admin_can_upload_video_for_information()
    {
        Storage::fake('public');

        $admin = User::factory()->create(['is_admin' => true]);
        $information = Information::factory()->create();

        $file = UploadedFile::fake()->create('project.mp4', 1000, 'video/mp4');

        $response = $this->actingAs($admin)->patch(route('admin.information.update', $information->key), [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'file' => $file,
        ]);

        $response->assertRedirect();
        $information->refresh();

        $this->assertNotNull($information->file_path);
        $this->assertEquals('video/mp4', $information->mime_type);
        Storage::disk('public')->assertExists($information->file_path);
    }

    public function test_old_file_is_deleted_when_new_file_is_uploaded()
    {
        Storage::fake('public');

        $admin = User::factory()->create(['is_admin' => true]);
        $information = Information::factory()->create([
            'file_path' => 'projects/files/old_file.jpg',
            'mime_type' => 'image/jpeg',
        ]);

        $oldFilePath = $information->file_path;

        $file = UploadedFile::fake()->image('new_file.jpg');

        $this->actingAs($admin)->patch(route('admin.information.update', $information->key), [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'file' => $file,
        ]);

        $information->refresh();

        $this->assertNotEquals($oldFilePath, $information->file_path);
        Storage::disk('public')->assertMissing($oldFilePath);
        Storage::disk('public')->assertExists($information->file_path);
    }
}