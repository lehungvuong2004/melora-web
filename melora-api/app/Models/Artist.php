<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    protected $fillable = [
        'name', 'slug', 'bio', 'avatar_url', 'cover_url', 'country', 'is_verified', 'monthly_listeners'
    ];

    protected $casts = [
        'is_verified' => 'boolean',
    ];

    public function albums()
    {
        return $this->hasMany(Album::class);
    }

    public function songs()
    {
        return $this->belongsToMany(Song::class, 'songs_artists', 'artist_id', 'song_id')->withPivot('is_primary')->withTimestamps();
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'user_followed_artists', 'artist_id', 'user_id')->withTimestamps();
    }
}
