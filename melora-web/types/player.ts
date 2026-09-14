export type Song = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  cover_url: string;
  artists?: unknown[];
};

export type PlayerContextType = {
  currentSong: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  progress: number;
  duration: number;
  playSong: (song: Song, newPlaylist?: Song[], forcePlay?: boolean) => void;
  togglePlayPause: () => void;
  seek: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
  playNext: () => void;
  playPrev: () => void;
  toggleShuffle: () => void;
  isShuffle: boolean;
  toggleRepeat: () => void;
  repeatMode: "off" | "all" | "one";
};
