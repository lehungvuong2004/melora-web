import json
import sys
import os
import re

try:
    from spotify_scraper import SpotifyClient
    import yt_dlp
except ImportError:
    print("Error: Required libraries are missing. Please run: pip install spotifyscraper yt-dlp")
    sys.exit(1)

def build_slug(name):
    # Simple slugify for filename
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

def download_youtube_audio(title, artist):
    query = f"{title} {artist} official audio"
    filename = build_slug(f"{title}-{artist}")
    
    music_dir = "public/music"
    os.makedirs(music_dir, exist_ok=True)
    out_path = os.path.join(music_dir, f"{filename}.m4a")
    
    # Return existing if already downloaded
    if os.path.exists(out_path):
        return f"/music/{filename}.m4a"
        
    print(f"   --> Đang tải nhạc thật từ YouTube: {query}")
    ydl_opts = {
        'format': 'bestaudio[ext=m4a]/bestaudio', # We use m4a to avoid ffmpeg requirement on Windows
        'outtmpl': out_path,
        'quiet': True,
        'default_search': 'ytsearch1:',
        'noplaylist': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([query])
            return f"/music/{filename}.m4a"
    except Exception as e:
        print(f"   [!] Lỗi tải nhạc: {e}")
        return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

def main():
    query = sys.argv[1] if len(sys.argv) > 1 else "vietnamese pop"
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        
    print(f"Searching Spotify for '{query}' (limit: {limit})...")
    
    albums_map = {}
    artists_map = {}
    songs_list = []
    
    with SpotifyClient() as client:
        results = client.search(query, types=("track",), limit=limit)
        
        tracks = getattr(results, 'tracks', [])
        
        if not tracks:
            print("No tracks found!")
            sys.exit(0)
            
        print(f"Found {len(tracks)} tracks. Bắt đầu xử lý và tải nhạc...")
        for track in tracks:
            td = track.to_dict()
            
            song_title = td.get("name")
            primary_artist = td.get("artists", [{}])[0].get("name", "Unknown")
            
            print(f" + Đang xử lý: {song_title}")
            
            # Tải nhạc thật!
            real_audio_url = download_youtube_audio(song_title, primary_artist)
            
            song = {
                "title": song_title,
                "audio_url": real_audio_url,
                "duration_seconds": td.get("duration_ms", 0) // 1000,
                "spotify_url": td.get("external_urls", {}).get("spotify", ""),
                "is_explicit": td.get("explicit", False),
            }
            
            album_id = None
            album = td.get("album")
            if album:
                album_id = album.get("id")
                images = album.get("images", [])
                cover_url = images[0]["url"] if images else "https://ui-avatars.com/api/?name=Album&background=random"
                song["cover_url"] = cover_url
                
                if album_id not in albums_map:
                    # sometimes release_date is partial year only, but laravel needs date sometimes, we will handle that in laravel
                    release_date = album.get("release_date", "2023-01-01")
                    if len(release_date) == 4:
                        release_date += "-01-01"
                        
                    albums_map[album_id] = {
                        "title": album.get("name"),
                        "cover_url": cover_url,
                        "release_date": release_date,
                        "album_type": str(album.get("album_type", "ALBUM")).upper()
                    }
                    
                    if albums_map[album_id]["album_type"] not in ["ALBUM", "SINGLE", "EP", "COMPILATION"]:
                        albums_map[album_id]["album_type"] = "ALBUM"
            else:
                song["cover_url"] = "https://ui-avatars.com/api/?name=Song&background=random"
                
            song["album_id"] = album_id
            
            song_artists = []
            for idx, art in enumerate(td.get("artists", [])):
                # If there's no id, fallback to uri or even name
                art_id = art.get("id") or art.get("uri") or art.get("name")
                if not art_id: continue
                
                song_artists.append({
                    "id": art_id,
                    "is_primary": idx == 0
                })
                
                if art_id not in artists_map:
                    artists_map[art_id] = {
                        "name": art.get("name") or str(art_id),
                        "avatar_url": song["cover_url"]
                    }
            
            song["artists"] = song_artists
            songs_list.append(song)
            print(f" + Scraped: {song['title']}")

    # Ensure directory exists
    output_dir = "storage/app"
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, "spotify_data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "albums": albums_map,
            "artists": artists_map,
            "songs": songs_list
        }, f, indent=4, ensure_ascii=False)
        
    print(f"\n✅ Successfully saved scraped data to {output_path}")
    print("Now run: php artisan spotify:import to load this into your database.")

if __name__ == "__main__":
    main()
