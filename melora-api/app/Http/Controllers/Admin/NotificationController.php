<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
  public function index(Request $request)
  {
    $query = Notification::with('user')->latest('created_at');

    $notifications = $query->paginate(20);
    return $this->successResponse($notifications);
  }

  public function store(Request $request)
  {
    $request->validate([
      'user_id' => 'nullable|integer|exists:users,id',
      'type' => 'required|string|max:50',
      'title' => 'required|string|max:255',
      'message' => 'required|string',
    ]);

    if ($request->user_id) {
      $notification = Notification::create([
        'user_id' => $request->user_id,
        'type' => $request->type,
        'title' => $request->title,
        'message' => $request->message,
        'is_read' => false,
        'created_at' => now(),
      ]);
      return $this->successResponse($notification, 'Đã gửi thông báo cho người dùng này.', 201);
    } else {
      $users = User::all();
      $notifications = [];
      foreach ($users as $user) {
        $notifications[] = [
          'user_id' => $user->id,
          'type' => $request->type,
          'title' => $request->title,
          'message' => $request->message,
          'is_read' => false,
          'created_at' => now(),
        ];
      }
      if (count($notifications) > 0) {
        Notification::insert($notifications);
      }
      return $this->successResponse(null, 'Đã gửi thông báo đại trà cho tất cả người dùng.', 201);
    }
  }

  public function update(Request $request, string $id)
  {
    $request->validate([
      'title' => 'required|string|max:255',
      'message' => 'required|string',
    ]);

    $notification = Notification::findOrFail($id);
    $notification->update([
      'title' => $request->title,
      'message' => $request->message,
    ]);

    return $this->successResponse($notification, 'Cập nhật thành công');
  }

  public function destroy(string $id)
  {
    $notification = Notification::findOrFail($id);
    $notification->delete();
    return $this->successResponse(null, 'Xóa thành công');
  }
}
