<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function index(Request $request)
  {
    $query = User::with('roles');
    
    if ($search = $request->query('search')) {
      $query->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%");
    }
    
    if ($request->query('limit') === 'all') {
      return response()->json(['data' => $query->get()]);
    }
    
    return response()->json($query->paginate(20));
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:100',
      'email' => 'required|string|email|max:191|unique:users',
      'password' => 'required|string|min:6',
      'status' => 'nullable|string'
    ]);

    $validated['password'] = Hash::make($validated['password']);
    $validated['status'] = $validated['status'] ?? 'ACTIVE';

    $user = User::create($validated);
    return response()->json($user, 201);
  }

  public function show(string $id)
  {
    return response()->json(User::with('roles')->findOrFail($id));
  }

  public function update(Request $request, string $id)
  {
    $user = User::findOrFail($id);

    $validated = $request->validate([
      'name' => 'sometimes|string|max:100',
      'email' => 'sometimes|string|email|max:191|unique:users,email,' . $id,
      'password' => 'sometimes|string|min:6',
      'status' => 'sometimes|string'
    ]);

    if (isset($validated['password'])) {
      $validated['password'] = Hash::make($validated['password']);
    }

    $user->update($validated);
    return response()->json($user);
  }

  public function destroy(string $id)
  {
    User::findOrFail($id)->delete();
    return response()->json(null, 204);
  }
}
