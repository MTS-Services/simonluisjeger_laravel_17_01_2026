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
            $table->string('text1_link_hover_color', 7)->nullable()->after('text1_link_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('background_texts', function (Blueprint $table) {
            $table->dropColumn(['text1_link_hover_color']);
        });
    }
};

