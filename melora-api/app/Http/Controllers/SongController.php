<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;

class SongController extends Controller
{
    public function index(Request $request)
    {
        $query = Song::with(['artists', 'album'])->where('status', 'PUBLISHED');
        
        if ($request->has('q')) {
            $query->where('title', 'like', '%' . $request->q . '%');
        }

        $songs = $query->paginate(20);
        return $this->successResponse($songs);
    }

    public function store(Request $request)
    {
        // Add basic logic for storing, maybe admin only
        $song = Song::create($request->all());
        return $this->successResponse($song, 'Song created', 201);
    }

    public function show(Song $song)
    {
        $song->load(['artists', 'album']);
        return $this->successResponse($song);
    }

    public function update(Request $request, Song $song)
    {
        $song->update($request->all());
        return $this->successResponse($song, 'Song updated');
    }

    public function destroy(Song $song)
    {
        $song->delete();
        return $this->successResponse(null, 'Song deleted');
    }

    public function top()
    {
        $song = Song::with(['artists', 'album'])->where('status', 'PUBLISHED')->orderBy('play_count', 'desc')->take(10)->get();
        return $this->successResponse($song);
    }

    public function toggleLike(Request $request, Song $song)
    {
        $user = $request->user();
        if ($user->likedSongs()->where('song_id', $song->id)->exists()) {
            $user->likedSongs()->detach($song->id);
            return $this->successResponse(['liked' => false], 'Song unliked');
        } else {
            $user->likedSongs()->attach($song->id);
            return $this->successResponse(['liked' => true], 'Song liked');
        }
    }
}
