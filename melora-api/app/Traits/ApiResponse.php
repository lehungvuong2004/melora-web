<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
  /**
   * Return a success JSON response.
   *
   * @param  array|object  $data
   * @param  string  $message
   * @param  int  $code
   * @return \Illuminate\Http\JsonResponse
   */
  protected function successResponse($data = [], string $message = 'Request successful', int $code = 200): JsonResponse
  {
    return response()->json([
      'success' => true,
      'message' => $message,
      'data'    => $data,
    ], $code);
  }

  /**
   * Return an error JSON response.
   *
   * @param  string  $message
   * @param  int  $code
   * @param  array  $errors
   * @return \Illuminate\Http\JsonResponse
   */
  protected function errorResponse(string $message, int $code, array $errors = []): JsonResponse
  {
    $response = [
      'success' => false,
      'message' => $message,
    ];

    if (!empty($errors)) {
      $response['errors'] = $errors;
    }

    return response()->json($response, $code);
  }
}
