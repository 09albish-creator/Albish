
export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl?: string;
  color?: string;
  lyrics?: LyricLine[];
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export interface ChatMessage {
  role: 'user' | 'miku' | 'miku-system-offline';
  text: string;
  timestamp: number;
}

export enum PlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped'
}
