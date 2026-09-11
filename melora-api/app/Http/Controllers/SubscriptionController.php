<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
  public function index(Request $request)
  {
    $subscriptions = $request->user()->subscriptions()->latest()->get();
    return $this->successResponse($subscriptions);
  }

  public function current(Request $request)
  {
    $subscription = $request->user()->subscriptions()->where('status', 'ACTIVE')->where('expires_at', '>', now())->latest()->first();
    if (!$subscription) {
      return $this->successResponse(['plan' => 'FREE', 'status' => 'ACTIVE']);
    }
    return $this->successResponse($subscription);
  }

  public function cancel(Request $request)
  {
    $subscription = $request->user()->subscriptions()->where('status', 'ACTIVE')->latest()->first();
    if ($subscription) {
      $subscription->update(['status' => 'CANCELLED']);
      return $this->successResponse($subscription, 'Subscription cancelled');
    }
    return $this->errorResponse('No active subscription found', 404);
  }
}
