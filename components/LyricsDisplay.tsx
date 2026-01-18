
import React, { useEffect, useRef, useMemo } from 'react';
import { LyricLine } from '../types';
import { VisualizerTheme } from './Visualizer';

interface LyricsDisplayProps {
  lyrics?: LyricLine[];
  currentTime: number;
  isPlaying: boolean;
  theme: VisualizerTheme;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, currentTime, isPlaying, theme }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  const activeLineIndex = useMemo(() => {
    if (!lyrics) return -1;
    let index = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [lyrics, currentTime]);

  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeLine = activeLineRef.current;
      
      const scrollPosition = activeLine.offsetTop - (container.offsetHeight / 2) + (activeLine.offsetHeight / 2);
      
      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [activeLineIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-center font-mono text-sm text-white/20 italic">
        ♪ No lyrics data loaded... ♪
      </div>
    );
  }

  const themeClass = theme === 'miku-cyan' ? 'miku-cyan glow-cyan' : theme === 'luka-pink' ? 'miku-pink' : theme === 'matrix-green' ? 'text-[#00FF41]' : 'text-[#FFD700]';

  return (
    <div 
      ref={scrollContainerRef} 
      className="h-32 w-full overflow-y-scroll relative mask-gradient custom-scrollbar-hidden"
    >
      <div className="py-16"> {/* Padding to allow first and last lines to be centered */}
        {lyrics.map((line, index) => (
          <p
            key={index}
            ref={index === activeLineIndex ? activeLineRef : null}
            className={`text-center font-black text-2xl p-2 transition-all duration-300 ease-in-out tracking-tighter italic ${
              index === activeLineIndex && isPlaying
                ? `scale-105 ${themeClass}`
                : 'text-white/30 scale-100'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LyricsDisplay;
