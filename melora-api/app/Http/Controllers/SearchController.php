<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Song;
use App\Models\Artist;
use App\Models\Album;
use App\Models\Playlist;

class SearchController extends Controller
{
  public function search(Request $request)
  {
    $q = $request->query('q');

    if (!$q) {
      return $this->successResponse([
        'songs' => [],
        'artists' => [],
        'albums' => [],
        'playlists' => [],
      ]);
    }

    $songs = Song::with(['artists', 'album'])->where('title', 'like', "%{$q}%")->where('status', 'PUBLISHED')->take(10)->get();
    $artists = Artist::where('name', 'like', "%{$q}%")->take(10)->get();
    $albums = Album::where('title', 'like', "%{$q}%")->take(10)->get();
    $playlists = Playlist::where('name', 'like', "%{$q}%")->where('visibility', 'PUBLIC')->take(10)->get();

    return $this->successResponse([
      'songs' => $songs,
      'artists' => $artists,
      'albums' => $albums,
      'playlists' => $playlists,
    ]);
  }
}
