<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListeningHistory extends Model
{
    protected $table = 'listening_history';
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'song_id', 'played_at', 'duration_played', 'completed', 'device'
    ];

    protected $casts = [
        'played_at' => 'datetime',
        'completed' => 'boolean',
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
