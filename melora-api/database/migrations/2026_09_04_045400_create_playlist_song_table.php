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
    Schema::create('playlist_song', function (Blueprint $table) {
      $table->unsignedBigInteger('playlist_id');
      $table->foreign('playlist_id')->references('id')->on('playlists')->onDelete('cascade')->onUpdate('cascade');
      $table->unsignedBigInteger('song_id');
      $table->foreign('song_id')->references('id')->on('songs')->onDelete('cascade')->onUpdate('cascade');
      $table->unsignedInteger('position');
      $table->timestamp('added_at')->nullable()->useCurrent();
      $table->primary(['playlist_id', 'song_id']);
      $table->index(['playlist_id', 'position']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('playlist_song');
  }
};
