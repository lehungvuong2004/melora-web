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
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('artist_id');
            $table->foreign('artist_id')->references('id')->on('artists')->onDelete('restrict')->onUpdate('cascade');
            $table->string('title', 200);
            $table->string('slug', 191)->unique();
            $table->text('description')->nullable();
            $table->string('cover_url', 500)->nullable();
            $table->enum('album_type', ['ALBUM', 'SINGLE', 'EP', 'COMPILATION'])->default('ALBUM');
            $table->date('release_date')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
