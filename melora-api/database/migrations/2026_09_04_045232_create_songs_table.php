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
        Schema::create('songs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('album_id')->nullable();
            $table->foreign('album_id')->references('id')->on('albums')->onDelete('set null')->onUpdate('cascade');
            $table->string('title', 191)->index();
            $table->string('slug', 191)->unique();
            $table->text('description')->nullable();
            $table->string('audio_url', 255);
            $table->string('cover_url', 255)->nullable();
            $table->longText('lyrics')->nullable();
            $table->unsignedInteger('duration_seconds');
            $table->unsignedInteger('track_number')->nullable();
            $table->date('release_date')->nullable();
            $table->boolean('is_explicit')->default(false);
            $table->unsignedBigInteger('play_count')->default(0)->index();
            $table->enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('songs');
    }
};
