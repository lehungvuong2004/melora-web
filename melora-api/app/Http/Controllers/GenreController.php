<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
  public function index(Request $request)
  {
    $genres = Genre::all();
    return $this->successResponse($genres);
  }

  public function store(Request $request)
  {
    $genre = Genre::create($request->all());
    return $this->successResponse($genre, 'Genre created', 201);
  }

  public function show(Genre $genre)
  {
    return $this->successResponse($genre);
  }

  public function update(Request $request, Genre $genre)
  {
    $genre->update($request->all());
    return $this->successResponse($genre, 'Genre updated');
  }

  public function destroy(Genre $genre)
  {
    $genre->delete();
    return $this->successResponse(null, 'Genre deleted');
  }

  public function songs(Genre $genre)
  {
    return $this->successResponse($genre->songs()->with('artists')->paginate(20));
  }
}
