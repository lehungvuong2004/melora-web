<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SongController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\ArtistController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\WishlistController;

Route::get('search', [SearchController::class, 'search']);
Route::get('songs/top', [SongController::class, 'top']);
Route::apiResource('songs', SongController::class);

Route::prefix('auth')->group(function () {
  Route::post('/register', [AuthController::class, 'register']);
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/refresh', [AuthController::class, 'refreshToken']);
  Route::post('/google', [AuthController::class, 'googleLogin']);
  Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
  Route::post('/reset-password', [AuthController::class, 'resetPassword']);

  Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
  });
});

Route::apiResource('artists', ArtistController::class);
Route::get('artists/{artist}/albums', [ArtistController::class, 'albums']);
Route::get('artists/{artist}/songs', [ArtistController::class, 'songs']);
Route::apiResource('albums', AlbumController::class);
Route::get('albums/{album}/songs', [AlbumController::class, 'songs']);
Route::apiResource('genres', GenreController::class);
Route::get('genres/{genre}/songs', [GenreController::class, 'songs']);

Route::middleware('auth:sanctum')->group(function () {
  Route::post('songs/{song}/like', [SongController::class, 'toggleLike']);
  Route::apiResource('playlists', PlaylistController::class);
  Route::post('playlists/{playlist}/songs', [PlaylistController::class, 'addSong']);
  Route::delete('playlists/{playlist}/songs/{song}', [PlaylistController::class, 'removeSong']);
  Route::get('me/likes', [LibraryController::class, 'likedSongs']);
  Route::get('me/wishlists', [WishlistController::class, 'index']);
  Route::post('me/wishlists', [WishlistController::class, 'toggle']);
  Route::get('me/following/artists', [LibraryController::class, 'followedArtists']);
  Route::post('me/following/artists/{artist}', [LibraryController::class, 'toggleFollowArtist']);
  Route::get('me/following/playlists', [LibraryController::class, 'followedPlaylists']);
  Route::post('me/following/playlists/{playlist}', [LibraryController::class, 'toggleFollowPlaylist']);
  Route::get('me/history', [LibraryController::class, 'history']);
  Route::post('me/history', [LibraryController::class, 'recordHistory']);
  Route::get('me/recently-played', [LibraryController::class, 'recentlyPlayed']);
  Route::get('subscriptions', [SubscriptionController::class, 'index']);
  Route::get('subscriptions/current', [SubscriptionController::class, 'current']);
  Route::post('subscriptions/cancel', [SubscriptionController::class, 'cancel']);
  Route::get('payments', [PaymentController::class, 'index']);
  Route::post('payments', [PaymentController::class, 'store']);
  Route::get('payments/callback', [PaymentController::class, 'callback'])->withoutMiddleware('auth:sanctum');
  Route::get('notifications', [NotificationController::class, 'index']);
  Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
  Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);

  Route::post('reports', [ReportController::class, 'store']);
});

// Admin routes (should have middleware admin)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
  Route::get('stats', [DashboardController::class, 'stats']);
  Route::get('reports', [ReportController::class, 'index']);
  Route::put('reports/{report}', [ReportController::class, 'update']);
});
