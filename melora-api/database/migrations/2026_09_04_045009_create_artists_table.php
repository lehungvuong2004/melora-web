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
    Schema::create('artists', function (Blueprint $table) {
      $table->id();
      $table->string('name', 150)->index();
      $table->string('slug', 180)->unique();
      $table->text('bio')->nullable();
      $table->string('avatar_url', 500)->nullable();
      $table->string('cover_url', 500)->nullable();
      $table->string('country', 100)->nullable();
      $table->boolean('is_verified')->default(false)->index();
      $table->unsignedBigInteger('monthly_listeners')->default(0);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('artists');
  }
};
