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
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
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
      return $this->errorResponse('Dữ liệu không hợp lệ', 422, $validator->errors()->toArray());
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

    return $this->successResponse([
      'access_token' => $accessToken,
      'refresh_token' => $refreshToken,
      'user' => $user
    ], 'Tạo tài khoản thành công', 201);
  }

  public function login(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|string|email',
      'password' => 'required|string',
    ]);

    if ($validator->fails()) {
      return $this->errorResponse('Dữ liệu không hợp lệ', 422, $validator->errors()->toArray());
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !$user->password || !Hash::check($request->password, $user->password)) {
      return $this->errorResponse('Email hoặc mật khẩu không chính xác', 401);
    }

    // Delete previous access tokens to ensure only 1 valid device or specific rules
    $user->tokens()->where('name', 'access_token')->delete();

    $accessToken = $user->createToken('access_token', ['access-api'], now()->addHours(2))->plainTextToken;
    $refreshToken = $user->createToken('refresh_token', ['issue-access-token'], now()->addDays(30))->plainTextToken;

    return $this->successResponse([
      'access_token' => $accessToken,
      'refresh_token' => $refreshToken,
      'user' => $user
    ], 'Đăng nhập thành công');
  }

  public function refreshToken(Request $request)
  {
    $request->validate(['refresh_token' => 'required|string']);

    $token = PersonalAccessToken::findToken($request->refresh_token);

    if (!$token || !in_array('issue-access-token', $token->abilities)) {
      return $this->errorResponse('Refresh token không hợp lệ.', 401);
    }

    if ($token->expires_at && now()->gt($token->expires_at)) {
      return $this->errorResponse('Refresh token đã hết hạn. Vui lòng đăng nhập lại.', 401);
    }

    $user = $token->tokenable;

    $user->tokens()->where('name', 'access_token')->delete();

    $newAccessToken = $user->createToken('access_token', ['access-api'], now()->addHours(2))->plainTextToken;

    return $this->successResponse([
      'access_token' => $newAccessToken,
    ], 'Làm mới token thành công');
  }

  public function googleLogin(Request $request)
  {
    $request->validate(['token' => 'required|string']);

    try {
      $googleDriver = Socialite::driver('google')->stateless();

      // Fix lỗi cURL error 60 ở môi trường Windows
      $googleDriver->setHttpClient(new Client(['verify' => false]));

      $googleUser = $googleDriver->userFromToken($request->token);

      $socialAccount = DB::table('social_accounts')
        ->where('provider_name', 'google')
        ->where('provider_id', $googleUser->getId())
        ->first();

      $user = null;

      if ($socialAccount) {
        $user = User::find($socialAccount->user_id);
        if (!$user) {
          DB::table('social_accounts')->where('id', $socialAccount->id)->delete();
          $socialAccount = null;
        }
      }

      if (!$socialAccount) {
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

      return $this->successResponse([
        'access_token' => $accessToken,
        'refresh_token' => $refreshToken,
        'user' => $user
      ], 'Đăng nhập bằng Google thành công');
    } catch (Exception $e) {
      Log::error('Google Login Error: ' . $e->getMessage());
      return $this->errorResponse('Google Token không hợp lệ: ' . $e->getMessage(), 401);
    }
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();
    return $this->successResponse(null, 'Đăng xuất thành công');
  }

  public function me(Request $request)
  {
    $user = $request->user()->load('roles');
    return $this->successResponse($user, 'Lấy thông tin người dùng thành công');
  }

  public function forgotPassword(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email|exists:users,email'
    ]);

    if ($validator->fails()) {
      return $this->errorResponse('Dữ liệu không hợp lệ', 422, $validator->errors()->toArray());
    }

    $token = Str::random(64);

    DB::table('password_reset_tokens')->updateOrInsert(
      ['email' => $request->email],
      [
        'token' => $token,
        'created_at' => now()
      ]
    );

    // TODO: Send email with token. This is just an API placeholder
    return $this->successResponse([
      'token' => $token // In production, don't return the token in API response, send via email.
    ], 'Tạo mã khôi phục mật khẩu thành công');
  }

  public function resetPassword(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email|exists:users,email',
      'token' => 'required|string',
      'password' => 'required|string|min:6|confirmed'
    ]);

    if ($validator->fails()) {
      return $this->errorResponse('Validation failed', 422, $validator->errors()->toArray());
    }

    $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

    if (!$record || $record->token !== $request->token) {
      return $this->errorResponse('Mã khôi phục không hợp lệ hoặc đã hết hạn', 400);
    }

    $user = User::where('email', $request->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();

    DB::table('password_reset_tokens')->where('email', $request->email)->delete();

    return $this->successResponse(null, 'Khôi phục mật khẩu thành công');
  }
}
