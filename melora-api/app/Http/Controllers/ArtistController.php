<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
  public function index(Request $request)
  {
    $query = Artist::query();

    if ($request->has('q')) {
      $query->where('name', 'like', '%' . $request->q . '%');
    }

    $artists = $query->paginate(20);
    return $this->successResponse($artists);
  }

  public function store(Request $request)
  {
    $artist = Artist::create($request->all());
    return $this->successResponse($artist, 'Artist created', 201);
  }

  public function show(Artist $artist)
  {
    return $this->successResponse($artist);
  }

  public function update(Request $request, Artist $artist)
  {
    $artist->update($request->all());
    return $this->successResponse($artist, 'Artist updated');
  }

  public function destroy(Artist $artist)
  {
    $artist->delete();
    return $this->successResponse(null, 'Artist deleted');
  }

  public function albums(Artist $artist)
  {
    return $this->successResponse($artist->albums()->latest('release_date')->get());
  }

  public function songs(Artist $artist)
  {
    return $this->successResponse($artist->songs()->with('album')->latest('release_date')->paginate(20));
  }
}
