<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
  public function store(Request $request)
  {
    $request->validate([
      'reportable_id' => 'required|integer',
      'reportable_type' => 'required|string|in:App\Models\Song,App\Models\Artist,App\Models\Playlist',
      'reason' => 'required|string|max:500'
    ]);

    $report = Report::create([
      'user_id' => $request->user()->id,
      'reportable_id' => $request->reportable_id,
      'reportable_type' => $request->reportable_type,
      'reason' => $request->reason,
      'status' => 'PENDING',
    ]);

    return $this->successResponse($report, 'Report submitted successfully', 201);
  }

  // Admin routes
  public function index(Request $request)
  {
    $reports = Report::with(['user'])->latest()->paginate(20);
    return $this->successResponse($reports);
  }

  public function update(Request $request, Report $report)
  {
    $request->validate(['status' => 'required|in:PENDING,REVIEWING,RESOLVED,REJECTED']);
    $report->update(['status' => $request->status]);
    return $this->successResponse($report, 'Report status updated');
  }
}
