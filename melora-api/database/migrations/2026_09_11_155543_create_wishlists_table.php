<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('wishlists', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
      $table->string('wishlistable_type');
      $table->unsignedBigInteger('wishlistable_id');
      $table->timestamps();

      $table->index(['wishlistable_type', 'wishlistable_id']);
      $table->unique(['user_id', 'wishlistable_type', 'wishlistable_id'], 'wishlist_unique');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('wishlists');
  }
};
