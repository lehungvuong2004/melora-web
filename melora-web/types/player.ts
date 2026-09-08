export type Song = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  cover_url: string;
  artists?: any[];
};

export type PlayerContextType = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  seek: (value: number) => void;
  volume: number;
  setVolume: (value: number) => void;
};
