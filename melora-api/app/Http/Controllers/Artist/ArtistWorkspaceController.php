<?php

namespace App\Http\Controllers\Artist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Song;
use App\Models\Artist;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ArtistWorkspaceController extends Controller
{
    private function getArtist(Request $request)
    {
        $user = $request->user();
        if (!$user) return null;
        
        $artist = Artist::where('user_id', $user->id)->first();
        if (!$artist) {
            $artist = Artist::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'slug' => Str::slug($user->name) . '-' . uniqid(),
                'avatar_url' => $user->avatar_url,
                'bio' => 'Nghệ sĩ mới tại Melora.',
            ]);
        }
        return $artist;
    }

    public function stats(Request $request)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        $followers = $artist->followers()->count();
        $totalPlays = $artist->songs()->sum('play_count');
        $songsCount = $artist->songs()->count();
        $monthlyListeners = $artist->monthly_listeners;

        return $this->successResponse([
            'followers' => $followers,
            'streams' => $totalPlays,
            'songsCount' => $songsCount,
            'monthlyListeners' => $monthlyListeners,
            'artist' => $artist
        ]);
    }

    public function mySongs(Request $request)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        $songs = $artist->songs()->orderBy('created_at', 'desc')->paginate(20);
        return $this->successResponse($songs);
    }

    public function audience(Request $request)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        $songs = $artist->songs()
            ->where('songs.status', 'PUBLISHED')
            ->orderBy('play_count', 'desc')
            ->get(['songs.id', 'songs.title', 'songs.cover_url', 'songs.play_count', 'songs.created_at']);

        $totalPlays = $songs->sum('play_count');

        return $this->successResponse([
            'total_plays' => $totalPlays,
            'songs' => $songs,
        ]);
    }

    public function uploadSong(Request $request)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        if ($request->hasFile('audio')) {
            $file = $request->file('audio');
            if (!$file->isValid()) {
                return $this->errorResponse('Audio file is invalid. Upload error code: ' . $file->getError(), 400);
            }
        } else {
            // Log for debugging - show all received fields
            \Log::warning('Artist uploadSong: No audio file received.', [
                'files' => array_keys($request->allFiles()),
                'input' => array_keys($request->all()),
                'content_type' => $request->header('Content-Type'),
            ]);
        }

        $request->validate([
            'title' => 'required|string|max:191',
            'audio' => 'required|file',
            'cover' => 'nullable|image',
            'lyrics' => 'nullable|string',
            'is_explicit' => 'nullable|boolean'
        ], [
            'audio.required' => 'Vui lòng chọn file âm thanh.',
            'audio.file' => 'File âm thanh không hợp lệ.',
        ]);

        $audioPath = $request->file('audio')->store('songs/audio', 'public');
        $audioUrl = url(Storage::disk('public')->url($audioPath));

        $coverUrl = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('songs/covers', 'public');
            $coverUrl = url(Storage::disk('public')->url($coverPath));
        }

        $song = Song::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'audio_url' => $audioUrl,
            'cover_url' => $coverUrl,
            'lyrics' => $request->lyrics,
            'is_explicit' => $request->boolean('is_explicit'),
            'duration_seconds' => 180, // In a real app we'd getID3
            'status' => 'DRAFT',
            'release_date' => now()
        ]);

        $song->artists()->attach($artist->id, ['is_primary' => true]);

        return $this->successResponse($song, 'Đã tải lên bài hát thành công (Đang chờ duyệt)', 201);
    }

    public function updateSong(Request $request, $id)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        $song = $artist->songs()->where('song_id', $id)->first();
        if (!$song) return $this->errorResponse('Không tìm thấy bài hát', 404);

        $request->validate([
            'title' => 'required|string|max:191',
            'lyrics' => 'nullable|string',
            'is_explicit' => 'nullable|boolean'
        ]);

        $song->update([
            'title' => $request->title,
            'lyrics' => $request->lyrics,
            'is_explicit' => $request->boolean('is_explicit', $song->is_explicit),
        ]);

        return $this->successResponse($song, 'Cập nhật bài hát thành công');
    }

    public function deleteSong(Request $request, $id)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        $song = $artist->songs()->where('song_id', $id)->first();
        if (!$song) return $this->errorResponse('Không tìm thấy bài hát', 404);

        $song->delete();
        return $this->successResponse(null, 'Đã xóa bài hát');
    }

    public function updateProfile(Request $request)
    {
        $artist = $this->getArtist($request);
        if (!$artist) return $this->errorResponse('Unauthorized', 401);

        $request->validate([
            'name' => 'required|string|max:150',
            'bio' => 'nullable|string',
            'country' => 'nullable|string',
            'avatar' => 'nullable|image'
        ]);

        $avatarUrl = $artist->avatar_url;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('public/artists/avatars');
            $avatarUrl = url(Storage::url($avatarPath));
        }

        $artist->update([
            'name' => $request->name,
            'bio' => $request->bio,
            'country' => $request->country,
            'avatar_url' => $avatarUrl
        ]);

        return $this->successResponse($artist, 'Cập nhật hồ sơ thành công');
    }
}
