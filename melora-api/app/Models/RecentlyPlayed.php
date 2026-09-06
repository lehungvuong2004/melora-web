<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecentlyPlayed extends Model
{
    protected $table = 'recently_played';
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'song_id', 'played_at'
    ];

    protected $casts = [
        'played_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function song()
    {
        return $this->belongsTo(Song::class);
    }
}
