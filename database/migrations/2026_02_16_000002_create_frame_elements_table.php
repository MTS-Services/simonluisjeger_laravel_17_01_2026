<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('frame_elements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('frame_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('overlay_image');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->enum('media_type', ['image', 'video'])->nullable();
            $table->string('media_url')->nullable();
            $table->decimal('x_pct', 8, 4)->default(10);
            $table->decimal('y_pct', 8, 4)->default(10);
            $table->decimal('w_pct', 8, 4)->default(10);
            $table->decimal('h_pct', 8, 4)->default(10);
            $table->unsignedInteger('z_index')->default(1);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['frame_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('frame_elements');
    }
};
