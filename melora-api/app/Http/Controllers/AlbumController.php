<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
  public function index(Request $request)
  {
    $query = Album::with('artist');

    if ($request->has('q')) {
      $query->where('title', 'like', '%' . $request->q . '%');
    }

    $albums = $query->paginate(20);
    return $this->successResponse($albums);
  }

  public function store(Request $request)
  {
    $album = Album::create($request->all());
    return $this->successResponse($album, 'Album created', 201);
  }

  public function show(Album $album)
  {
    $album->load('artist');
    return $this->successResponse($album);
  }

  public function update(Request $request, Album $album)
  {
    $album->update($request->all());
    return $this->successResponse($album, 'Album updated');
  }

  public function destroy(Album $album)
  {
    $album->delete();
    return $this->successResponse(null, 'Album deleted');
  }

  public function songs(Album $album)
  {
    return $this->successResponse($album->songs()->with('artists')->orderBy('track_number')->get());
  }
}
