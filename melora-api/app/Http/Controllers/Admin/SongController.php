<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;

class SongController extends Controller
{
  public function index(Request $request)
  {
    $status = $request->query('status');
    $search = $request->query('search');

    $query = Song::with(['artists', 'album']);

    if ($status) {
      $query->where('status', $status);
    }

    if ($search) {
      $query->where(function($q) use ($search) {
          $q->where('title', 'like', "%{$search}%")
            ->orWhereHas('artists', function($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%");
            });
      });
    }

    return response()->json($query->paginate(20));
  }

  public function show(string $id)
  {
    return response()->json(Song::with(['artist', 'album', 'genres'])->findOrFail($id));
  }

  public function approve(Request $request, string $id)
  {
    $song = Song::findOrFail($id);

    $validated = $request->validate([
      'status' => 'required|in:PUBLISHED,REJECTED'
    ]);

    $song->update(['status' => $validated['status']]);

    return response()->json($song);
  }

  public function update(Request $request, string $id)
  {
    $song = Song::findOrFail($id);
    $song->update($request->all());
    return response()->json($song);
  }

  public function destroy(string $id)
  {
    Song::findOrFail($id)->delete();
    return response()->json(null, 204);
  }
}
