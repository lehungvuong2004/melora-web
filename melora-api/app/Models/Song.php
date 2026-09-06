<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = [
        'album_id', 'title', 'slug', 'description', 'audio_url', 'cover_url', 'lyrics', 'duration_seconds', 'track_number', 'release_date', 'is_explicit', 'play_count', 'status'
    ];

    protected $casts = [
        'release_date' => 'date',
        'is_explicit' => 'boolean',
    ];

    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    public function artists()
    {
        return $this->belongsToMany(Artist::class, 'songs_artists', 'song_id', 'artist_id')->withPivot('is_primary')->withTimestamps();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'songs_genres', 'song_id', 'genre_id');
    }

    public function playlists()
    {
        return $this->belongsToMany(Playlist::class, 'playlist_song', 'song_id', 'playlist_id')->withPivot('position', 'added_at');
    }

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'user_liked_songs', 'song_id', 'user_id')->withTimestamps();
    }
}
