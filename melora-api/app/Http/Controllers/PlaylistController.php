<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use App\Models\Song;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
  public function index(Request $request)
  {
    $playlists = $request->user()->playlists()->latest()->get();
    return $this->successResponse($playlists);
  }

  public function store(Request $request)
  {
    $request->validate([
      'name' => 'required|string|max:100',
      'visibility' => 'in:PUBLIC,PRIVATE'
    ]);

    $playlist = $request->user()->playlists()->create([
      'name' => $request->name,
      'description' => $request->description,
      'visibility' => $request->visibility ?? 'PRIVATE',
    ]);

    return $this->successResponse($playlist, 'Playlist created', 201);
  }

  public function show(Request $request, Playlist $playlist)
  {
    if ($playlist->visibility === 'PRIVATE' && $playlist->user_id !== $request->user()->id) {
      return $this->errorResponse('Unauthorized', 403);
    }

    $playlist->load(['songs.artists', 'songs.album']);
    return $this->successResponse($playlist);
  }

  public function update(Request $request, Playlist $playlist)
  {
    if ($playlist->user_id !== $request->user()->id) {
      return $this->errorResponse('Unauthorized', 403);
    }

    $playlist->update($request->only('name', 'description', 'visibility', 'cover_url'));
    return $this->successResponse($playlist, 'Playlist updated');
  }

  public function destroy(Request $request, Playlist $playlist)
  {
    if ($playlist->user_id !== $request->user()->id) {
      return $this->errorResponse('Unauthorized', 403);
    }

    $playlist->delete();
    return $this->successResponse(null, 'Playlist deleted');
  }

  public function addSong(Request $request, Playlist $playlist)
  {
    if ($playlist->user_id !== $request->user()->id) {
      return $this->errorResponse('Unauthorized', 403);
    }

    $request->validate(['song_id' => 'required|exists:songs,id']);

    if (!$playlist->songs()->where('song_id', $request->song_id)->exists()) {
      $position = $playlist->songs()->count() + 1;
      $playlist->songs()->attach($request->song_id, [
        'position' => $position,
        'added_at' => now(),
      ]);
    }

    return $this->successResponse(null, 'Song added to playlist');
  }

  public function removeSong(Request $request, Playlist $playlist, Song $song)
  {
    if ($playlist->user_id !== $request->user()->id) {
      return $this->errorResponse('Unauthorized', 403);
    }

    $playlist->songs()->detach($song->id);
    return $this->successResponse(null, 'Song removed from playlist');
  }
}
