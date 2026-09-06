<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

echo "Disabling foreign key checks...\n";
DB::statement('SET FOREIGN_KEY_CHECKS=0;');

echo "Truncating tables...\n";
DB::table('songs_artists')->truncate();
DB::table('playlist_song')->truncate();
DB::table('user_liked_songs')->truncate();
DB::table('songs')->truncate();
DB::table('albums')->truncate();
DB::table('artists')->truncate();

echo "Adding timestamps to songs_artists if missing...\n";
if (!Schema::hasColumn('songs_artists', 'created_at')) {
    Schema::table('songs_artists', function (Blueprint $table) {
        $table->timestamps();
    });
    echo "Added timestamps to songs_artists.\n";
} else {
    echo "Timestamps already exist in songs_artists.\n";
}

echo "Enabling foreign key checks...\n";
DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "All done!\n";
