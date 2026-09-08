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
    Schema::create('payments', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('user_id');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict')->onUpdate('cascade');
      $table->unsignedBigInteger('subscription_id')->nullable();
      $table->foreign('subscription_id')->references('id')->on('subcriptions')->onDelete('set null')->onUpdate('cascade');
      $table->decimal('amount', 12, 2);
      $table->char('currency', 3)->default('VND');
      $table->enum('provider', ['MOMO', 'VNPAY', 'STRIPE']);
      $table->string('transaction_id', 191)->unique();
      $table->enum('status', ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'])->default('PENDING')->index();
      $table->timestamp('paid_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('payments');
  }
};
