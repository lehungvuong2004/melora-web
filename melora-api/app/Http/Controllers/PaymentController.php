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

    if ($request->provider === 'VNPAY') {
      $vnp_TmnCode = env('VNPAY_TMN_CODE', '');
      $vnp_HashSecret = env('VNPAY_HASH_SECRET', '');
      $vnp_Url = env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
      $vnp_Returnurl = env('VNPAY_RETURN_URL', 'http://localhost:3000/payment/vnpay/return');
      $vnp_TxnRef = $payment->transaction_id;

      $vnp_OrderInfo = "Thanh toan don hang " . $vnp_TxnRef;
      $vnp_OrderType = "billpayment";
      $vnp_Amount = $request->amount * 100;
      $vnp_Locale = "vn";
      $vnp_IpAddr = $request->ip();

      $inputData = array(
        "vnp_Version" => "2.1.0",
        "vnp_TmnCode" => $vnp_TmnCode,
        "vnp_Amount" => $vnp_Amount,
        "vnp_Command" => "pay",
        "vnp_CreateDate" => date('YmdHis'),
        "vnp_CurrCode" => "VND",
        "vnp_IpAddr" => $vnp_IpAddr,
        "vnp_Locale" => $vnp_Locale,
        "vnp_OrderInfo" => $vnp_OrderInfo,
        "vnp_OrderType" => $vnp_OrderType,
        "vnp_ReturnUrl" => $vnp_Returnurl,
        "vnp_TxnRef" => $vnp_TxnRef,
      );

      ksort($inputData);
      $query = "";
      $i = 0;
      $hashdata = "";

      foreach ($inputData as $key => $value) {
        if ($i == 1) {
          $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
        } else {
          $hashdata .= urlencode($key) . "=" . urlencode($value);
          $i = 1;
        }
        $query .= urlencode($key) . "=" . urlencode($value) . '&';
      }

      $vnp_Url = $vnp_Url . "?" . $query;
      if ($vnp_HashSecret) {
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
      }
      $paymentUrl = $vnp_Url;
    } else {
      // Mock payment URL
      $paymentUrl = url('/api/payments/callback?transaction_id=' . $payment->transaction_id . '&status=SUCCESS&plan=' . $request->plan);
    }

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

  public function vnpayCallback(Request $request)
  {
    $vnp_HashSecret = env('VNPAY_HASH_SECRET', '');
    $inputData = array();

    foreach ($request->all() as $key => $value) {
      if (substr($key, 0, 4) == "vnp_") {
        $inputData[$key] = $value;
      }
    }

    $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
    unset($inputData['vnp_SecureHash']);
    ksort($inputData);
    $i = 0;
    $hashData = "";
    foreach ($inputData as $key => $value) {
      if ($i == 1) {
        $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
      } else {
        $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
        $i = 1;
      }
    }

    $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

    if ($secureHash === $vnp_SecureHash) {
      if ($request->input('vnp_ResponseCode') == '00') {
        $transaction_id = $request->input('vnp_TxnRef');
        $payment = Payment::where('transaction_id', $transaction_id)->first();

        if ($payment && $payment->status === 'PENDING') {
          $payment->update(['status' => 'SUCCESS']);
          $user = $payment->user;
          $user->subscriptions()->update(['status' => 'EXPIRED']);
          $user->subscriptions()->create([
            'plan' => 'PREMIUM',
            'status' => 'ACTIVE',
            'expires_at' => now()->addMonth(),
          ]);
          return $this->successResponse($payment, 'Payment processed successfully');
        }
        return $this->errorResponse('Payment already processed or not found', 400);
      }
      return $this->errorResponse('Payment failed by VNPay', 400);
    } else {
      return $this->errorResponse('Invalid signature', 400);
    }
  }
}
