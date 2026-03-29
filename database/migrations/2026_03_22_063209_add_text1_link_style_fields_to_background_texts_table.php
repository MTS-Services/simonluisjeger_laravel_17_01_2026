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
            if (! Schema::hasColumn('background_texts', 'text1_link_word')) {
                $table->string('text1_link_word', 100)->nullable()->after('text1');
            }
            if (! Schema::hasColumn('background_texts', 'text1_link_color')) {
                $table->string('text1_link_color', 7)->nullable()->after('text1_link_element_name');
            }
            if (! Schema::hasColumn('background_texts', 'text1_link_underline')) {
                $table->boolean('text1_link_underline')->default(true)->after('text1_link_color');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('background_texts', function (Blueprint $table) {
            if (Schema::hasColumn('background_texts', 'text1_link_underline')) {
                $table->dropColumn('text1_link_underline');
            }
            if (Schema::hasColumn('background_texts', 'text1_link_color')) {
                $table->dropColumn('text1_link_color');
            }
            if (Schema::hasColumn('background_texts', 'text1_link_word')) {
                $table->dropColumn('text1_link_word');
            }
        });
    }
};
