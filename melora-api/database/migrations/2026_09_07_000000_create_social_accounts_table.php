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
    Schema::create('social_accounts', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('user_id')->index('idx_social_user');
      $table->string('provider_name', 50);
      $table->string('provider_id', 191);
      $table->timestamp('created_at')->useCurrent()->nullable();

      $table->foreign('user_id', 'fk_social_user')
        ->references('id')
        ->on('users')
        ->onDelete('cascade')
        ->onUpdate('cascade');

      $table->unique(['provider_name', 'provider_id'], 'idx_social_provider_id');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('social_accounts');
  }
};
