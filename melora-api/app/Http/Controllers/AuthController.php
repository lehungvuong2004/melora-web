<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use Exception;

class AuthController extends Controller
{
  public function register(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:100',
      'email' => 'required|string|email|max:191|unique:users',
      'password' => 'required|string|min:6',
      'country' => 'nullable|string|max:100',
      'date_of_birth' => 'nullable|date',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
      'country' => $request->country,
      'date_of_birth' => $request->date_of_birth,
      'status' => 'ACTIVE',
    ]);

    $accessToken = $user->createToken('access_token', ['access-api'], now()->addHours(2))->plainTextToken;
    $refreshToken = $user->createToken('refresh_token', ['issue-access-token'], now()->addDays(30))->plainTextToken;

    return response()->json([
      'message' => 'User created successfully',
      'access_token' => $accessToken,
      'refresh_token' => $refreshToken,
      'user' => $user
    ], 201);
  }

  public function login(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|string|email',
      'password' => 'required|string',
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !$user->password || !Hash::check($request->password, $user->password)) {
      return response()->json(['message' => 'Invalid email or password'], 401);
    }

    $user->tokens()->where('name', 'access_token')->delete();

    $accessToken = $user->createToken('access_token', ['access-api'], now()->addHours(2))->plainTextToken;
    $refreshToken = $user->createToken('refresh_token', ['issue-access-token'], now()->addDays(30))->plainTextToken;

    return response()->json([
      'message' => 'Logged in successfully',
      'access_token' => $accessToken,
      'refresh_token' => $refreshToken,
      'user' => $user
    ]);
  }

  public function refreshToken(Request $request)
  {
    $request->validate(['refresh_token' => 'required|string']);

    $token = PersonalAccessToken::findToken($request->refresh_token);

    if (!$token || !in_array('issue-access-token', $token->abilities)) {
      return response()->json(['message' => 'Invalid refresh token.'], 401);
    }

    if ($token->expires_at && now()->gt($token->expires_at)) {
      return response()->json(['message' => 'Refresh token expired. Please login again.'], 401);
    }

    $user = $token->tokenable;

    $user->tokens()->where('name', 'access_token')->delete();

    // Cấp lại access_token mới
    $newAccessToken = $user->createToken('access_token', ['access-api'], now()->addHours(2))->plainTextToken;

    return response()->json([
      'message' => 'Token refreshed successfully',
      'access_token' => $newAccessToken,
    ]);
  }

  public function googleLogin(Request $request)
  {
      $request->validate(['token' => 'required|string']);

      try {
          $googleDriver = Socialite::driver('google')->stateless();
          
          // Fix lỗi cURL error 60 ở môi trường Windows (Thiếu file chứng chỉ SSL Cacert)
          $googleDriver->setHttpClient(new Client(['verify' => false]));
          
          $googleUser = $googleDriver->userFromToken($request->token);
          
          $socialAccount = DB::table('social_accounts')
              ->where('provider_name', 'google')
              ->where('provider_id', $googleUser->getId())
              ->first();

          $user = null;

          if ($socialAccount) {
              $user = User::find($socialAccount->user_id);
          } else {
              $user = User::where('email', $googleUser->getEmail())->first();
              if (!$user) {
                  $user = User::create([
                      'name' => $googleUser->getName(),
                      'email' => $googleUser->getEmail(),
                      'password' => null, 
                      'avatar_url' => $googleUser->getAvatar(),
                      'status' => 'ACTIVE'
                  ]);
              }
              
              DB::table('social_accounts')->insert([
                  'user_id' => $user->id,
                  'provider_name' => 'google',
                  'provider_id' => $googleUser->getId(),
                  'created_at' => now(),
              ]);
          }

          $user->tokens()->where('name', 'access_token')->delete();

          $accessToken = $user->createToken('access_token', ['access-api'], now()->addHours(2))->plainTextToken;
          $refreshToken = $user->createToken('refresh_token', ['issue-access-token'], now()->addDays(30))->plainTextToken;

          return response()->json([
              'message' => 'Google Login Successful',
              'access_token' => $accessToken,
              'refresh_token' => $refreshToken,
              'user' => $user
          ]);

      } catch (Exception $e) {
          return response()->json(['message' => 'Invalid Google Token', 'error' => $e->getMessage()], 401);
      }
  }
}
