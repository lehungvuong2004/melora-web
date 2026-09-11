<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
  public function index(Request $request)
  {
    $notifications = $request->user()->notifications()->latest()->paginate(20);
    return $this->successResponse($notifications);
  }

  public function markAsRead(Request $request, Notification $notification)
  {
    if ($notification->user_id !== $request->user()->id) {
      return $this->errorResponse('Unauthorized', 403);
    }

    $notification->update(['status' => 'READ']);
    return $this->successResponse($notification, 'Notification marked as read');
  }

  public function markAllAsRead(Request $request)
  {
    $request->user()->notifications()->where('status', 'UNREAD')->update(['status' => 'READ']);
    return $this->successResponse(null, 'All notifications marked as read');
  }
}
