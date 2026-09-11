<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Song;
use App\Models\Playlist;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
  public function stats(Request $request)
  {
    // Require ADMIN role check in middleware but we just provide logic here

    $totalUsers = User::count();
    $totalSongs = Song::count();
    $totalPlaylists = Playlist::count();
    $activeSubscriptions = Subscription::where('status', 'ACTIVE')->count();
    $totalRevenue = Payment::where('status', 'SUCCESS')->sum('amount');

    return $this->successResponse([
      'total_users' => $totalUsers,
      'total_songs' => $totalSongs,
      'total_playlists' => $totalPlaylists,
      'active_subscriptions' => $activeSubscriptions,
      'total_revenue' => $totalRevenue,
    ]);
  }
}
