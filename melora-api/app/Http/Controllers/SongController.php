<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;

class SongController extends Controller
{
    public function index()
    {
        // Get all songs with their associated artists
        $songs = Song::with('artists')->get();
        return response()->json($songs);
    }

    public function top()
    {
        $song = Song::with('artists')->orderBy('play_count', 'desc')->first();
        return response()->json($song);
    }
}
