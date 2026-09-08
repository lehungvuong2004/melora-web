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
    Schema::create('songs_genres', function (Blueprint $table) {
      $table->unsignedBigInteger('song_id');
      $table->foreign('song_id')->references('id')->on('songs')->onDelete('cascade')->onUpdate('cascade');
      $table->unsignedBigInteger('genre_id');
      $table->foreign('genre_id')->references('id')->on('genres')->onDelete('cascade')->onUpdate('cascade');
      $table->primary(['song_id', 'genre_id']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('songs_genres');
  }
};
