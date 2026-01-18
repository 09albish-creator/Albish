
import React from 'react';
import { Song, LyricLine } from './types';

export const MIKU_SONGS: Song[] = [
  {
    id: '1',
    title: 'World is Mine',
    artist: 'supercell feat. Hatsune Miku',
    coverUrl: 'https://picsum.photos/seed/miku1/400/400',
    duration: 254,
    color: '#39C5BB',
    lyrics: [
      { time: 5, text: "Sekai de ichiban ohime-sama" },
      { time: 10, text: "Sou iu atsukai kokoroete yo ne" },
      { time: 18, text: "Sono ichi itsumo to chigau kamigata ni ki ga tsuku koto" },
      { time: 24, text: "Sono ni chanto kutsu made miru koto ii ne?" },
      { time: 30, text: "Sono san watashi no hito koto ni wa mitsu no kotoba de henji suru koto" },
      { time: 36, text: "Wakattara migite ga orusu nano o nantoka shite!" },
      { time: 42, text: "Betsu ni wagamama nante ittenain dakara" },
      { time: 48, text: "Kimi ni kokoro kara omotte hoshii no kawaii tte" },
      { time: 54, text: "Sekai de ichiban ohime-sama" },
      { time: 60, text: "Ki ga tsuite ne e ne e" },
      { time: 65, text: "Mataseru nante rongai yo" },
      { time: 70, text: "Watashi o dare da to omotteru no?" },
      { time: 75, text: "Mou nanda ka amai mono ga tabetai!" },
      { time: 80, text: "Ima sugu ni yo" },
    ]
  },
  {
    id: '2',
    title: 'Senbonzakura',
    artist: 'WhiteFlame feat. Hatsune Miku',
    coverUrl: 'https://picsum.photos/seed/miku2/400/400',
    duration: 245,
    color: '#FF5E8E',
    lyrics: [
      { time: 5, text: "Daitan futeki ni haikara kakumei" },
      { time: 10, text: "Rai rai rakuraku hansen kokka" },
      { time: 15, text: "Hinomaru jirushi no nirinsha korogashi" },
      { time: 20, text: "Akuryou taisan ICBM" },
      { time: 25, text: "Kanjousen o hashirinukete" },
      { time: 30, text: "Touhon seisou nan no sono" },
      { time: 35, text: "Shounen shoujo sengoku musou" },
      { time: 40, text: "Ukiyo no manima ni" },
      { time: 45, text: "Senbonzakura yoru ni magire" },
      { time: 50, text: "Kimi no koe mo todokanai yo" },
    ]
  },
  {
    id: '3',
    title: 'Tell Your World',
    artist: 'kz (livetune) feat. Hatsune Miku',
    coverUrl: 'https://picsum.photos/seed/miku3/400/400',
    duration: 257,
    color: '#ffffff',
    lyrics: [
      { time: 10, text: "Kimi ga tsutaetai koto wa" },
      { time: 15, text: "Kimi ga todoketai koto wa" },
      { time: 20, text: "Takusan no ten to ten o musunde" },
      { time: 25, text: "En ni natte ookiku natte yuku koto" },
      { time: 32, text: "Sore ga subete o kaete yuku" },
      { time: 38, text: "Sore ga subete o tsunagete yuku" },
      { time: 45, text: "Katachi ni shita denki no nami" },
      { time: 50, text: "Jibun no koe de" },
      { time: 55, text: "Tell your world" }
    ]
  },
  {
    id: '4',
    title: 'Melt',
    artist: 'supercell feat. Hatsune Miku',
    coverUrl: 'https://picsum.photos/seed/miku4/400/400',
    duration: 258,
    color: '#39C5BB',
    lyrics: [
      { time: 8, text: "Asa me ga samete" },
      { time: 12, text: "Massaki ni omoiukabu" },
      { time: 16, text: "Kimi no koto" },
      { time: 20, text: "Omoikitte maegami o kitta" },
      { time: 25, text: "'Doushita no?' tte kikaretakute" },
      { time: 30, text: "Pinku no sukaato ohanano kamikazari" },
      { time: 36, text: "Sashite dekakeru no" },
      { time: 40, text: "Kyou no watashi wa kawaii no yo!" },
      { time: 45, text: "Meruto toketeshimaisou" },
      { time: 50, text: "Suki da nante zettai ni ienai" }
    ]
  },
  {
    id: '5',
    title: 'Rolling Girl',
    artist: 'wowaka feat. Hatsune Miku',
    coverUrl: 'https://picsum.photos/seed/miku5/400/400',
    duration: 215,
    color: '#555555',
    lyrics: [
      { time: 5, text: "Ronrii gaaru wa itsumademo" },
      { time: 9, text: "Todokanai yume mite" },
      { time: 13, text: "Sawagu atama no naka o" },
      { time: 17, text: "Kakimawashite, kakimawashite" },
      { time: 22, text: "'Mondai nai.' to tsubuyaite" },
      { time: 26, text: "Kotoba wa ushinawareta?" },
      { time: 30, text: "Mou shippai, mou shippai" },
      { time: 34, text: "Machigai sagashi ni owareba, mata, mawaru no!" },
      { time: 38, text: "Mou ikkai, mou ikkai" },
      { time: 42, text: "Watashi wa kyou mo korogarimasu to" },
      { time: 46, text: "Shoujo wa iu shoujo wa iu" },
    ]
  }
];

// Define icon props to ensure consistency and fix TS errors when using className across different icons
interface IconProps {
  size?: number;
  className?: string;
  filled?: boolean;
}

export const Icons = {
  Play: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8 5v14l11-7z"/></svg>
  ),
  Pause: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
  ),
  SkipForward: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
  ),
  SkipBack: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
  ),
  Shuffle: ({ size = 20, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
  ),
  Volume: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
  ),
  Heart: ({ size = 24, className = "", filled = false }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#FF5E8E" : "none"} stroke={filled ? "#FF5E8E" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  ),
  Search: ({ size = 20, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Send: ({ size = 20, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
  ),
  Leek: ({ size = 24, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21s-2-4-2-8c0-5 3-9 3-9s1 2 2 3c1-1 2-3 2-3s3 4 3 9c0 4-2 8-2 8" stroke="#39C5BB" />
      <path d="M12 21l-1-4" stroke="#FFF" />
      <path d="M11 17s1.5 0 1.5 1" stroke="#FFF" />
    </svg>
  )
};
