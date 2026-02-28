<?php

use App\Models\BackgroundText;
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
    ]);

    $response->assertRedirect();

    $backgroundText = BackgroundText::first();
    expect($backgroundText)->not->toBeNull()
        ->and($backgroundText->text1)->toBe('Hello World')
        ->and($backgroundText->text2)->toBe('Click to explore')
        ->and($backgroundText->background_color)->toBe('#ff0000')
        ->and($backgroundText->text_color)->toBe('#00ff00');
});

test('admin can update background text with colors', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    BackgroundText::create([
        'text1' => 'Original',
        'text2' => 'Original 2',
        'background_color' => '#d9d9d9',
        'text_color' => '#e6e6e6',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.background_text.update'), [
        'text1' => 'Updated',
        'text2' => 'Updated 2',
        'background_color' => '#000000',
        'text_color' => '#ffffff',
    ]);

    $response->assertRedirect();

    $backgroundText = BackgroundText::first();
    expect($backgroundText->background_color)->toBe('#000000')
        ->and($backgroundText->text_color)->toBe('#ffffff');
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
