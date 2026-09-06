<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    protected $fillable = [
        'user_id', 'name', 'description', 'cover_url', 'visibility'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function songs()
    {
        return $this->belongsToMany(Song::class, 'playlist_song', 'playlist_id', 'song_id')->withPivot('position', 'added_at')->orderBy('playlist_song.position');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'user_followed_playlists', 'playlist_id', 'user_id')->withTimestamps();
    }
}
