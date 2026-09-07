<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'avatar_url', 'country', 'date_of_birth', 'status', 'email_verified_at'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id')->withTimestamps();
    }

    public function playlists()
    {
        return $this->hasMany(Playlist::class);
    }

    public function likedSongs()
    {
        return $this->belongsToMany(Song::class, 'user_liked_songs', 'user_id', 'song_id')->withTimestamps();
    }

    public function followedArtists()
    {
        return $this->belongsToMany(Artist::class, 'user_followed_artists', 'user_id', 'artist_id')->withTimestamps();
    }

    public function followedPlaylists()
    {
        return $this->belongsToMany(Playlist::class, 'user_followed_playlists', 'user_id', 'playlist_id')->withTimestamps();
    }

    public function listeningHistory()
    {
        return $this->hasMany(ListeningHistory::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
