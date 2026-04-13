<?php

use App\Models\BackgroundText;
use App\Models\Frame;
use App\Models\FrameElement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can view background text page', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->get(route('admin.background_text'))
        ->assertOk();
});

test('admin can create background text with colors', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->post(route('admin.background_text.update'), [
        'text1' => 'Hello World',
        'text2' => 'Click to explore',
        'background_color' => '#ff0000',
        'text_color' => '#00ff00',
        'text1_link_hover_color' => '#123456',
    ]);

    $response->assertRedirect();

    $backgroundText = BackgroundText::first();
    expect($backgroundText)->not->toBeNull()
        ->and($backgroundText->text1)->toBe('Hello World')
        ->and($backgroundText->text2)->toBe('Click to explore')
        ->and($backgroundText->background_color)->toBe('#ff0000')
        ->and($backgroundText->text_color)->toBe('#00ff00')
        ->and($backgroundText->text1_link_hover_color)->toBe('#123456');
});

test('admin can update background text with colors', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    BackgroundText::create([
        'text1' => 'Original',
        'text2' => 'Original 2',
        'background_color' => '#d9d9d9',
        'text_color' => '#e6e6e6',
        'text1_link_hover_color' => null,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.background_text.update'), [
        'text1' => 'Updated',
        'text2' => 'Updated 2',
        'background_color' => '#000000',
        'text_color' => '#ffffff',
        'text1_link_hover_color' => '#abcdef',
    ]);

    $response->assertRedirect();

    $backgroundText = BackgroundText::first();
    expect($backgroundText->background_color)->toBe('#000000')
        ->and($backgroundText->text_color)->toBe('#ffffff')
        ->and($backgroundText->text1_link_hover_color)->toBe('#abcdef');
});

test('background text color fields are required', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->post(route('admin.background_text.update'), [
        'text1' => 'Hello',
        'text2' => 'World',
    ]);

    $response->assertSessionHasErrors(['background_color', 'text_color']);
});

test('background text colors default correctly in database', function () {
    $bt = BackgroundText::create([
        'text1' => 'Test',
        'text2' => 'Test 2',
    ]);

    $bt->refresh();
    expect($bt->background_color)->toBe('#d9d9d9')
        ->and($bt->text_color)->toBe('#e6e6e6');
});

test('admin can save text1 internal link as active frame element id', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $frame = Frame::factory()->create(['is_active' => true]);
    $element = FrameElement::factory()->create([
        'frame_id' => $frame->id,
        'name' => 'Hotspot A',
    ]);

    BackgroundText::create([
        'text1' => 'Hello',
        'text2' => 'World',
    ]);

    $this->actingAs($admin)->post(route('admin.background_text.update'), [
        'text1' => 'Hello <a>link</a>',
        'text2' => 'World',
        'background_color' => '#d9d9d9',
        'text_color' => '#e6e6e6',
        'text1_link_frame_element_id' => $element->id,
        'text1_link_element_name' => '',
    ])->assertRedirect();

    $bt = BackgroundText::first();
    expect($bt->text1_link_frame_element_id)->toBe($element->id);
});

test('background text update clears invalid frame element id from another frame', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $active = Frame::factory()->create(['is_active' => true]);
    $other = Frame::factory()->create(['is_active' => false]);
    $foreignElement = FrameElement::factory()->create(['frame_id' => $other->id]);

    BackgroundText::create([
        'text1' => 'Hello',
        'text2' => 'World',
    ]);

    $this->actingAs($admin)->post(route('admin.background_text.update'), [
        'text1' => 'Hello',
        'text2' => 'World',
        'background_color' => '#d9d9d9',
        'text_color' => '#e6e6e6',
        'text1_link_frame_element_id' => $foreignElement->id,
    ])->assertRedirect();

    expect(BackgroundText::first()->text1_link_frame_element_id)->toBeNull();
});
