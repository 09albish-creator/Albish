
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MIKU_SONGS, Icons } from './constants';
import { Song, PlayerState, Playlist } from './types';
import Visualizer, { VisualizerTheme, VisualizerStyle } from './components/Visualizer';
import LyricsDisplay from './components/LyricsDisplay';
import MikuChat from './components/MikuChat';
import { speakWithMiku } from './services/mikuVoiceService';
import { hapticFeedback } from './utils';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<Song>(MIKU_SONGS[0]);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.PAUSED);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(["DIVA OS BOOTING...", "INIT AUDIO ENGINE...", "MIKU SYNC: OK"]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 'fav', name: 'Favorites', songIds: [] }
  ]);
  const [activeView, setActiveView] = useState<'library' | string>('library');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [visualTheme, setVisualTheme] = useState<VisualizerTheme>('miku-cyan');
  const [visualStyle, setVisualStyle] = useState<VisualizerStyle>('bars');
  
  const volumeTimerRef = useRef<number | null>(null);

  const addLog = useCallback((msg: string) => {
    setSystemLogs(prev => [msg, ...prev.slice(0, 4)]);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOffline) {
      addLog("NETWORK OFFLINE");
    } else {
      addLog("NETWORK ONLINE: SYNC OK");
    }
  }, [isOffline, addLog]);

  useEffect(() => {
    setPlaylists(prev => prev.map(p => 
      p.id === 'fav' ? { ...p, songIds: Array.from(likedSongs) } : p
    ));
  }, [likedSongs]);

  const activePlaylist = useMemo(() => 
    playlists.find(p => p.id === activeView), 
  [playlists, activeView]);

  const displayedSongs = useMemo(() => {
    const baseList = activePlaylist 
      ? activePlaylist.songIds.map(id => MIKU_SONGS.find(s => s.id === id)!).filter(Boolean)
      : MIKU_SONGS;
    
    return baseList.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activePlaylist, searchQuery]);

  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setPlayerState(PlayerState.PLAYING);
    setCurrentTime(0);
    addLog(`PLAYING: ${song.title.toUpperCase()}`);
    if (voiceEnabled && !isOffline) speakWithMiku(`Playing ${song.title}!`);
  }, [voiceEnabled, addLog, isOffline]);

  const nextSong = useCallback(() => {
    hapticFeedback();
    if (displayedSongs.length === 0) return;
    const currentIndex = displayedSongs.findIndex(s => s.id === currentSong.id);
    
    let nextIndex;
    if (isShuffle && displayedSongs.length > 1) {
      nextIndex = currentIndex;
      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * displayedSongs.length);
      }
    } else {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % displayedSongs.length;
    }
    
    playSong(displayedSongs[nextIndex]);
  }, [currentSong.id, displayedSongs, playSong, isShuffle]);

  const prevSong = useCallback(() => {
    hapticFeedback();
    if (displayedSongs.length === 0) return;
    const currentIndex = displayedSongs.findIndex(s => s.id === currentSong.id);
    
    let prevIndex;
    if (isShuffle && displayedSongs.length > 1) {
      prevIndex = currentIndex;
      while (prevIndex === currentIndex) {
        prevIndex = Math.floor(Math.random() * displayedSongs.length);
      }
    } else {
      prevIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + displayedSongs.length) % displayedSongs.length;
    }
    
    playSong(displayedSongs[prevIndex]);
  }, [currentSong.id, displayedSongs, playSong, isShuffle]);

  const toggleShuffle = () => {
    hapticFeedback();
    setIsShuffle(!isShuffle);
    addLog(isShuffle ? "SHUFFLE MODE: DISABLED" : "SHUFFLE MODE: ENABLED");
    if (voiceEnabled && !isOffline) speakWithMiku(isShuffle ? "Order restored!" : "Let's mix it up!");
  };

  const createPlaylist = () => {
    const newId = Date.now().toString();
    const newPlaylist: Playlist = { id: newId, name: 'New Playlist', songIds: [] };
    setPlaylists([...playlists, newPlaylist]);
    setEditingPlaylistId(newId);
    setEditName('New Playlist');
    addLog("PLAYLIST CREATED");
    if (voiceEnabled && !isOffline) speakWithMiku("A new stage is ready!");
  };

  const deletePlaylist = (id: string) => {
    if (id === 'fav') return;
    setPlaylists(playlists.filter(p => p.id !== id));
    if (activeView === id) setActiveView('library');
    addLog("PLAYLIST DELETED");
  };

  const renamePlaylist = (id: string) => {
    if (!editName.trim()) return;
    setPlaylists(playlists.map(p => p.id === id ? { ...p, name: editName } : p));
    setEditingPlaylistId(null);
    addLog("PLAYLIST RENAMED");
  };

  const togglePlay = () => {
    hapticFeedback();
    const nextState = playerState === PlayerState.PLAYING ? PlayerState.PAUSED : PlayerState.PLAYING;
    setPlayerState(nextState);
    addLog(nextState === PlayerState.PLAYING ? "STREAMS STARTED" : "STREAMS PAUSED");
    if (voiceEnabled && !isOffline) {
      speakWithMiku(nextState === PlayerState.PLAYING ? "Music start!" : "Taking a break!");
    }
  };

  const toggleLike = (id: string) => {
    hapticFeedback();
    const next = new Set(likedSongs);
    if (next.has(id)) {
      next.delete(id);
      addLog("METADATA REMOVED: FAVORITE");
    } else {
      next.add(id);
      addLog("METADATA UPDATED: FAVORITE");
      if (voiceEnabled && !isOffline) speakWithMiku("I love this one too!");
    }
    setLikedSongs(next);
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    setIsAdjustingVolume(true);
    if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current);
    volumeTimerRef.current = window.setTimeout(() => setIsAdjustingVolume(false), 300);
  };

  useEffect(() => {
    let interval: number;
    if (playerState === PlayerState.PLAYING) {
      interval = window.setInterval(() => {
        setCurrentTime(t => {
          if (t >= currentSong.duration) {
            nextSong();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playerState, currentSong.duration, nextSong]);

  const binaryParticles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 10}s`, duration: `${8 + Math.random() * 12}s`, text: Math.random() > 0.5 ? '0' : '1'
  })), []);

  return (
    <div className={`flex h-screen bg-[#0a0e14] text-slate-100 overflow-hidden select-none relative font-['Outfit'] theme-${visualTheme}`}>
      {binaryParticles.map(p => (
        <div 
          key={p.id} 
          className="binary-particle" 
          style={{ 
            left: p.left, 
            animationDelay: p.delay, 
            animationDuration: p.duration, 
            color: visualTheme === 'miku-cyan' ? '#39C5BB' : visualTheme === 'luka-pink' ? '#FF5E8E' : visualTheme === 'matrix-green' ? '#00FF41' : '#FFD700' 
          }}
        >
          {p.text}
        </div>
      ))}

      <aside className="w-80 flex flex-col border-r border-white/10 bg-black/60 backdrop-blur-xl z-20">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8 group cursor-pointer" onClick={() => setActiveView('library')}>
            <div className="relative w-12 h-12">
              <div className={`absolute inset-0 rounded-lg animate-pulse opacity-40 blur-sm ${visualTheme === 'miku-cyan' ? 'bg-miku-cyan' : visualTheme === 'luka-pink' ? 'bg-miku-pink' : visualTheme === 'matrix-green' ? 'bg-[#00FF41]' : 'bg-[#FFD700]'}`}></div>
              <div className="relative w-12 h-12 bg-black border border-white/20 rounded-lg flex items-center justify-center tech-border tech-border-tl tech-border-br">
                <Icons.Leek size={28} className={visualTheme === 'miku-cyan' ? 'miku-cyan' : visualTheme === 'luka-pink' ? 'miku-pink' : visualTheme === 'matrix-green' ? 'text-[#00FF41]' : 'text-[#FFD700]'} />
              </div>
            </div>
            <div>
              <h1 className={`font-bold text-xl tracking-tight ${visualTheme === 'miku-cyan' ? 'miku-cyan glow-cyan' : visualTheme === 'luka-pink' ? 'miku-pink' : visualTheme === 'matrix-green' ? 'text-[#00FF41]' : 'text-[#FFD700]'}`}>MikuWave</h1>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono">DIVA-OS v3.9</p>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder="Search library..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-miku-cyan transition-all placeholder:text-white/20 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Playlist rendering code remains the same */}
          </div>

          <div className="mt-4 p-3 bg-black/40 border-t border-white/10 font-mono text-[9px] text-white/20 uppercase tracking-tighter">
            {systemLogs.map((log, i) => (
              <div key={i} className={`truncate ${i === 0 ? 'text-white/60' : 'text-white/20'}`}>{`> ${log}`}</div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0a1618] via-[#0a0e14] to-[#120a16] z-10 overflow-hidden">
        <div className="z-10 w-full max-w-2xl flex flex-col items-center">
          {/* Main player UI remains the same, except for the voice button */}
          <div className="flex items-center justify-center gap-10">
              <button 
                onClick={toggleShuffle} 
                className={`p-2 transition-all ${isShuffle ? (visualTheme === 'miku-cyan' ? 'miku-cyan glow-cyan' : 'miku-pink') + ' scale-110' : 'text-white/20 hover:text-white/40'}`}
                title="Shuffle"
              >
                <Icons.Shuffle size={24} />
              </button>
              <button onClick={prevSong} className="p-2 text-white/30 hover:text-miku-cyan hover:scale-125 transition-all"><Icons.SkipBack size={32} /></button>
              <button 
                onClick={togglePlay}
                className="group relative"
              >
                <div className={`absolute -inset-3 blur-lg rounded-full animate-pulse opacity-40 ${visualTheme === 'miku-cyan' ? 'bg-miku-cyan' : visualTheme === 'luka-pink' ? 'bg-miku-pink' : 'bg-white'}`}></div>
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-black shadow-2xl transition-all group-hover:scale-110 group-active:scale-95 border-4 border-black/20 ${visualTheme === 'miku-cyan' ? 'bg-miku-cyan' : visualTheme === 'luka-pink' ? 'bg-miku-pink' : visualTheme === 'matrix-green' ? 'bg-[#00FF41]' : 'bg-[#FFD700]'}`}>
                   {playerState === PlayerState.PLAYING ? <Icons.Pause size={40} /> : <Icons.Play size={40} />}
                </div>
              </button>
              <button onClick={nextSong} className="p-2 text-white/30 hover:text-miku-cyan hover:scale-125 transition-all"><Icons.SkipForward size={32} /></button>
              <button 
                onClick={() => {
                  if (isOffline) return;
                  hapticFeedback();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-2 transition-all ${voiceEnabled && !isOffline ? (visualTheme === 'miku-cyan' ? 'miku-cyan' : 'miku-pink') : 'text-white/20'} ${isOffline ? 'cursor-not-allowed' : ''}`}
                title={isOffline ? "Miku Voice unavailable offline" : "Miku Voice"}
              >
                <div className="relative">
                  <Icons.Leek size={24} />
                  {(!voiceEnabled || isOffline) && <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs">/</div>}
                </div>
              </button>
            </div>
        </div>
      </main>

      <aside className="w-[400px] hidden xl:block border-l border-white/10 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        <MikuChat playerState={playerState} isOffline={isOffline} />
      </aside>
    </div>
  );
};

export default App;
