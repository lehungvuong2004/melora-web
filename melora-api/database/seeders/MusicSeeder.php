<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Song;
use App\Models\Artist;
use \Illuminate\Support\Str;

class MusicSeeder extends Seeder
{
    public function run()
    {
        $bRay = Artist::firstOrCreate(['name' => 'B Ray'], ['slug' => 'b-ray', 'bio' => 'Vietnamese Rapper']);
        $bonJovi = Artist::firstOrCreate(['name' => 'Bon Jovi'], ['slug' => 'bon-jovi', 'bio' => 'American Rock Band']);
        $rihanna = Artist::firstOrCreate(['name' => 'Rihanna'], ['slug' => 'rihanna', 'bio' => 'Pop Singer']);

        $songs = [
            [
                'title' => 'Feel At Home',
                'audio_url' => '/music/feel-at-home-b-ray.m4a',
                'cover_url' => 'https://i.pravatar.cc/150?u=bray1',
                'artist' => $bRay,
                'duration_seconds' => 180,
            ],
            [
                'title' => 'Livin On A Prayer',
                'audio_url' => '/music/livin-on-a-prayer-bon-jovi.m4a',
                'cover_url' => 'https://i.pravatar.cc/150?u=bonjovi',
                'artist' => $bonJovi,
                'duration_seconds' => 249,
            ],
            [
                'title' => 'Love On The Brain',
                'audio_url' => '/music/love-on-the-brain-rihanna.m4a',
                'cover_url' => 'https://i.pravatar.cc/150?u=rihanna',
                'artist' => $rihanna,
                'duration_seconds' => 224,
            ],
            [
                'title' => 'Thói Hư Tật Xấu',
                'audio_url' => '/music/t-h-i-v-x-u-x-b-ray.m4a',
                'cover_url' => 'https://i.pravatar.cc/150?u=bray2',
                'artist' => $bRay,
                'duration_seconds' => 200,
            ],
            [
                'title' => 'Vòng An Toàn',
                'audio_url' => '/music/v-ng-an-to-n-b-ray.m4a',
                'cover_url' => 'https://i.pravatar.cc/150?u=bray3',
                'artist' => $bRay,
                'duration_seconds' => 210,
            ]
        ];

        foreach ($songs as $s) {
            $song = Song::create([
                'title' => $s['title'],
                'slug' => Str::slug($s['title']),
                'audio_url' => "http://localhost:8000" . $s['audio_url'],
                'cover_url' => $s['cover_url'],
                'duration_seconds' => $s['duration_seconds'],
                'status' => 'ACTIVE'
            ]);
            $song->artists()->attach($s['artist']->id, ['is_primary' => true]);
        }
    }
}
