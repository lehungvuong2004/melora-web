<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use \App\Http\Controllers\SongController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
Route::post('/auth/google', [AuthController::class, 'googleLogin']);

Route::get('/songs', [SongController::class, 'index']);
Route::get('/songs/top', [SongController::class, 'top']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
