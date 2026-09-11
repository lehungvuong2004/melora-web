<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Song;
use App\Models\Artist;
use App\Models\Playlist;
use App\Models\ListeningHistory;
use App\Models\RecentlyPlayed;

class LibraryController extends Controller
{
  public function likedSongs(Request $request)
  {
    $songs = $request->user()->likedSongs()->with(['artists', 'album'])->paginate(20);
    return $this->successResponse($songs);
  }

  public function followedArtists(Request $request)
  {
    $artists = $request->user()->followedArtists()->paginate(20);
    return $this->successResponse($artists);
  }

  public function toggleFollowArtist(Request $request, Artist $artist)
  {
    $user = $request->user();
    if ($user->followedArtists()->where('artist_id', $artist->id)->exists()) {
      $user->followedArtists()->detach($artist->id);
      return $this->successResponse(['followed' => false], 'Artist unfollowed');
    } else {
      $user->followedArtists()->attach($artist->id);
      return $this->successResponse(['followed' => true], 'Artist followed');
    }
  }

  public function followedPlaylists(Request $request)
  {
    $playlists = $request->user()->followedPlaylists()->paginate(20);
    return $this->successResponse($playlists);
  }

  public function toggleFollowPlaylist(Request $request, Playlist $playlist)
  {
    $user = $request->user();
    if ($user->followedPlaylists()->where('playlist_id', $playlist->id)->exists()) {
      $user->followedPlaylists()->detach($playlist->id);
      return $this->successResponse(['followed' => false], 'Playlist unfollowed');
    } else {
      $user->followedPlaylists()->attach($playlist->id);
      return $this->successResponse(['followed' => true], 'Playlist followed');
    }
  }

  public function history(Request $request)
  {
    $history = $request->user()->listeningHistory()->with(['song.artists', 'song.album'])->latest('played_at')->paginate(20);
    return $this->successResponse($history);
  }

  public function recordHistory(Request $request)
  {
    $request->validate([
      'song_id' => 'required|exists:songs,id',
      'duration_played' => 'required|integer',
      'completed' => 'required|boolean'
    ]);

    $user = $request->user();

    $user->listeningHistory()->create([
      'song_id' => $request->song_id,
      'played_at' => now(),
      'duration_played' => $request->duration_played,
      'completed' => $request->completed,
      'device' => $request->header('User-Agent'),
    ]);

    // Update recently played
    RecentlyPlayed::updateOrCreate(
      ['user_id' => $user->id, 'song_id' => $request->song_id],
      ['played_at' => now()]
    );

    // Increase play count on song
    Song::where('id', $request->song_id)->increment('play_count');

    return $this->successResponse(null, 'History recorded', 201);
  }

  public function recentlyPlayed(Request $request)
  {
    $recentlyPlayed = RecentlyPlayed::where('user_id', $request->user()->id)
      ->with(['song.artists', 'song.album'])
      ->orderBy('played_at', 'desc')
      ->take(20)
      ->get();

    return $this->successResponse($recentlyPlayed);
  }
}
