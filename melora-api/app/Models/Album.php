<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    protected $fillable = [
        'artist_id', 'title', 'slug', 'description', 'cover_url', 'album_type', 'release_date'
    ];

    protected $casts = [
        'release_date' => 'date',
    ];

    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    public function songs()
    {
        return $this->hasMany(Song::class);
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'album_genres', 'album_id', 'genre_id');
    }
}
