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
        Schema::table('frame_elements', function (Blueprint $table) {
            $table->string('hover_color', 9)->nullable()->after('rotation');
            $table->string('active_color', 9)->nullable()->after('hover_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frame_elements', function (Blueprint $table) {
            $table->dropColumn(['hover_color', 'active_color']);
        });
    }
};
