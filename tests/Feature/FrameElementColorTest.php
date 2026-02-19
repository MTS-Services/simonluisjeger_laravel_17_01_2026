<?php

use App\Models\Frame;
use App\Models\FrameElement;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->admin = User::factory()->create(['is_admin' => true]);
    $this->frame = Frame::factory()->create();
});

it('stores an element with hover and active colors', function () {
    $response = $this->actingAs($this->admin)->post(
        "/admin/frames/{$this->frame->id}/elements",
        [
            'name' => 'Color Test Element',
            'overlay_image' => UploadedFile::fake()->image('overlay.png'),
            'hover_color' => '#ff0000',
            'active_color' => '#00ff00',
        ]
    );

    $response->assertRedirect();

    $this->assertDatabaseHas('frame_elements', [
        'frame_id' => $this->frame->id,
        'name' => 'Color Test Element',
        'hover_color' => '#ff0000',
        'active_color' => '#00ff00',
    ]);
});

it('stores an element without colors when not provided', function () {
    $response = $this->actingAs($this->admin)->post(
        "/admin/frames/{$this->frame->id}/elements",
        [
            'name' => 'No Color Element',
            'overlay_image' => UploadedFile::fake()->image('overlay.png'),
        ]
    );

    $response->assertRedirect();

    $this->assertDatabaseHas('frame_elements', [
        'frame_id' => $this->frame->id,
        'name' => 'No Color Element',
        'hover_color' => null,
        'active_color' => null,
    ]);
});

it('updates an element with new hover and active colors', function () {
    $element = FrameElement::factory()->create([
        'frame_id' => $this->frame->id,
        'hover_color' => '#111111',
        'active_color' => '#222222',
    ]);

    $response = $this->actingAs($this->admin)->post(
        "/admin/frame-elements/{$element->id}",
        [
            'name' => $element->name,
            'hover_color' => '#aabbcc',
            'active_color' => '#ddeeff',
        ]
    );

    $response->assertRedirect();

    $element->refresh();
    expect($element->hover_color)->toBe('#aabbcc');
    expect($element->active_color)->toBe('#ddeeff');
});

it('clears colors when null is provided on update', function () {
    $element = FrameElement::factory()->create([
        'frame_id' => $this->frame->id,
        'hover_color' => '#ff0000',
        'active_color' => '#00ff00',
    ]);

    $response = $this->actingAs($this->admin)->post(
        "/admin/frame-elements/{$element->id}",
        [
            'name' => $element->name,
            'hover_color' => null,
            'active_color' => null,
        ]
    );

    $response->assertRedirect();

    $element->refresh();
    expect($element->hover_color)->toBeNull();
    expect($element->active_color)->toBeNull();
});

it('rejects invalid hex color format', function (string $field, string $value) {
    $response = $this->actingAs($this->admin)->post(
        "/admin/frames/{$this->frame->id}/elements",
        [
            'name' => 'Bad Color Element',
            'overlay_image' => UploadedFile::fake()->image('overlay.png'),
            $field => $value,
        ]
    );

    $response->assertSessionHasErrors($field);
})->with([
    'hover_color without hash' => ['hover_color', 'ff0000'],
    'hover_color invalid chars' => ['hover_color', '#zzzzzz'],
    'active_color without hash' => ['active_color', '00ff00'],
    'active_color too short' => ['active_color', '#ff'],
]);

it('includes color fields in element data sent to frontend', function () {
    FrameElement::factory()->create([
        'frame_id' => $this->frame->id,
        'hover_color' => '#ff0000',
        'active_color' => '#00ff00',
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/frame-editor');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/frame-editor')
        ->has('frame.elements.0', fn ($element) => $element
            ->where('hover_color', '#ff0000')
            ->where('active_color', '#00ff00')
            ->etc()
        )
    );
});

it('includes color fields in frontend home page data', function () {
    $this->frame->update(['is_active' => true]);

    FrameElement::factory()->create([
        'frame_id' => $this->frame->id,
        'hover_color' => '#aabb00',
        'active_color' => '#00bbaa',
    ]);

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('frontend/home')
        ->has('frame.elements.0', fn ($element) => $element
            ->where('hover_color', '#aabb00')
            ->where('active_color', '#00bbaa')
            ->etc()
        )
    );
});
