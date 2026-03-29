<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('background_texts', function (Blueprint $table) {
            $table->foreignId('text1_link_frame_element_id')
                ->nullable()
                ->after('text1_link_element_name')
                ->constrained('frame_elements')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('background_texts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('text1_link_frame_element_id');
        });
    }
};
