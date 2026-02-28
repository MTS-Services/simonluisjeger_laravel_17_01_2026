<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('background_texts', function (Blueprint $table) {
            $table->string('background_color', 7)->default('#d9d9d9')->after('text2');
            $table->string('text_color', 7)->default('#e6e6e6')->after('background_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('background_texts', function (Blueprint $table) {
            $table->dropColumn(['background_color', 'text_color']);
        });
    }
};
