<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
  public function index(Request $request)
  {
    $payments = $request->user()->payments()->latest()->paginate(20);
    return $this->successResponse($payments);
  }

  public function store(Request $request)
  {
    $request->validate([
      'plan' => 'required|in:PREMIUM,FAMILY',
      'provider' => 'required|in:MOMO,VNPAY,STRIPE',
      'amount' => 'required|numeric'
    ]);

    $payment = $request->user()->payments()->create([
      'amount' => $request->amount,
      'provider' => $request->provider,
      'status' => 'PENDING',
      'transaction_id' => Str::uuid()->toString(),
    ]);

    // Mock payment URL
    $paymentUrl = url('/api/payments/callback?transaction_id=' . $payment->transaction_id . '&status=SUCCESS&plan=' . $request->plan);

    return $this->successResponse([
      'payment' => $payment,
      'payment_url' => $paymentUrl
    ], 'Payment created', 201);
  }

  public function callback(Request $request)
  {
    $request->validate([
      'transaction_id' => 'required|string',
      'status' => 'required|in:SUCCESS,FAILED',
      'plan' => 'required|string'
    ]);

    $payment = Payment::where('transaction_id', $request->transaction_id)->firstOrFail();

    if ($payment->status !== 'PENDING') {
      return $this->errorResponse('Payment already processed', 400);
    }

    $payment->update(['status' => $request->status]);

    if ($request->status === 'SUCCESS') {
      $user = $payment->user;
      // Deactivate previous subscriptions
      $user->subscriptions()->update(['status' => 'EXPIRED']);

      // Create new subscription
      $user->subscriptions()->create([
        'plan' => $request->plan,
        'status' => 'ACTIVE',
        'expires_at' => now()->addMonth(),
      ]);
    }

    return $this->successResponse($payment, 'Payment processed');
  }
}
