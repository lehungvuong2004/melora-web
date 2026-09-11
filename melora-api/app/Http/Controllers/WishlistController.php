<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlists = $request->user()->wishlists()->with('wishlistable')->paginate(20);
        return $this->successResponse($wishlists);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:song,album,artist',
            'id' => 'required|integer'
        ]);

        $modelTypes = [
            'song' => \App\Models\Song::class,
            'album' => \App\Models\Album::class,
            'artist' => \App\Models\Artist::class,
        ];

        $modelType = $modelTypes[$request->type];

        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('wishlistable_type', $modelType)
            ->where('wishlistable_id', $request->id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return $this->successResponse(['added' => false], 'Removed from wishlist');
        } else {
            Wishlist::create([
                'user_id' => $request->user()->id,
                'wishlistable_type' => $modelType,
                'wishlistable_id' => $request->id
            ]);
            return $this->successResponse(['added' => true], 'Added to wishlist');
        }
    }
}
