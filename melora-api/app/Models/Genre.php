<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function songs()
    {
        return $this->belongsToMany(Song::class, 'songs_genres', 'genre_id', 'song_id');
    }

    public function albums()
    {
        return $this->belongsToMany(Album::class, 'album_genres', 'genre_id', 'album_id');
    }
}
