<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('frames', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Default Frame');
            $table->string('bg_image')->nullable();
            $table->string('base_svg')->nullable();
            $table->unsignedInteger('design_width')->default(1200);
            $table->unsignedInteger('design_height')->default(700);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('frames');
    }
};
