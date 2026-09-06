<?php

namespace App\Console\Commands;

use App\Models\Album;
use App\Models\Artist;
use App\Models\Song;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportSpotifyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'spotify:import {--file= : The path to the json file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import scraped Spotify data from JSON into the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->option('file') ?: storage_path('app/spotify_data.json');

        if (!File::exists($filePath)) {
            $this->error("File not found at: {$filePath}");
            return;
        }

        $this->info("Loading data from {$filePath}...");
        $data = json_decode(File::get($filePath), true);

        if (!$data) {
            $this->error("Invalid JSON format in {$filePath}");
            return;
        }

        $artists = $data['artists'] ?? [];
        $albums = $data['albums'] ?? [];
        $songs = $data['songs'] ?? [];

        $this->info(sprintf("Found %d artists, %d albums, %d songs.", count($artists), count($albums), count($songs)));

        // 1. Process Artists
        $artistIdMap = []; // old id => new local id
        foreach ($artists as $oldId => $artistData) {
            $artistObj = Artist::firstOrCreate(
                ['slug' => Str::slug($artistData['name'])],
                [
                    'name' => $artistData['name'],
                    'avatar_url' => $artistData['avatar_url'] ?? null,
                    'cover_url' => $artistData['avatar_url'] ?? null,
                    'is_verified' => true,
                    'monthly_listeners' => rand(10000, 5000000), // fake stats
                ]
            );
            $artistIdMap[$oldId] = $artistObj->id;
        }
        $this->info("Imported Artists.");

        // 2. Process Albums
        $albumIdMap = [];
        foreach ($albums as $oldId => $albumData) {
            
            // To assign an artist to the album, we need to know at least one artist of this album.
            // But from our JSON, albums don't store artist_id directly to keep it simple, 
            // except we might not have it. Let's just pick a random imported artist or the first one.
            // Actually, let's defer artist_id for albums, but it's required in DB. 
            // We will fix it to the first artist that references this album in the songs loop, 
            // but for now let's just pick the first artist in the map.
            if(count($artistIdMap) == 0) continue;
            
            $randomArtistId = collect($artistIdMap)->first();
            
            $albumObj = Album::firstOrCreate(
                ['slug' => Str::slug($albumData['title'])],
                [
                    'artist_id' => $randomArtistId,
                    'title' => $albumData['title'],
                    'cover_url' => $albumData['cover_url'] ?? null,
                    'album_type' => $albumData['album_type'] ?? 'ALBUM',
                    'release_date' => $albumData['release_date'] ?? '2023-01-01',
                ]
            );
            $albumIdMap[$oldId] = $albumObj->id;
        }
        $this->info("Imported Albums.");

        // 3. Process Songs
        foreach ($songs as $songData) {
            $localAlbumId = null;
            if (!empty($songData['album_id']) && isset($albumIdMap[$songData['album_id']])) {
                $localAlbumId = $albumIdMap[$songData['album_id']];
            }

            // Find primary artist to fix album artist_id if available
            $primaryLocalArtistId = null;
            if (!empty($songData['artists'])) {
                foreach ($songData['artists'] as $art) {
                    if ($art['is_primary'] && isset($artistIdMap[$art['id']])) {
                        $primaryLocalArtistId = $artistIdMap[$art['id']];
                        break;
                    }
                }
            }
            
            // Fix Album artist_id if we have a better one
            if ($localAlbumId && $primaryLocalArtistId) {
                Album::where('id', $localAlbumId)->update(['artist_id' => $primaryLocalArtistId]);
            }

            $slug = Str::slug($songData['title'] . '-' . Str::random(5)); // Random because of same titles!

            $songObj = Song::firstOrCreate(
                ['title' => $songData['title'], 'album_id' => $localAlbumId],
                [
                    'slug' => $slug,
                    'audio_url' => $songData['audio_url'] ?? '',
                    'cover_url' => $songData['cover_url'] ?? null,
                    'duration_seconds' => $songData['duration_seconds'] ?? 180,
                    'is_explicit' => $songData['is_explicit'] ?? false,
                    'status' => 'PUBLISHED',
                    'play_count' => rand(100, 10000),
                ]
            );

            // Sync Artists
            if (!empty($songData['artists'])) {
                $syncData = [];
                foreach ($songData['artists'] as $art) {
                    if (isset($artistIdMap[$art['id']])) {
                        $syncData[$artistIdMap[$art['id']]] = ['is_primary' => $art['is_primary']];
                    }
                }
                $songObj->artists()->sync($syncData);
            }
        }
        $this->info("Imported Songs.");

        $this->info("Done importing all Spotify data successfully!");
    }
}
