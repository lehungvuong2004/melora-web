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
    Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('name', 100);
      $table->string('email', 191)->unique();
      $table->string('password', 255)->nullable();
      $table->string('avatar_url', 500)->nullable();
      $table->string('country', 100)->nullable()->index();
      $table->date('date_of_birth')->nullable();
      $table->enum('status', ['ACTIVE', 'INACTIVE', 'BANNED'])->default('ACTIVE')->index();
      $table->timestamp('email_verified_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('users');
  }
};
