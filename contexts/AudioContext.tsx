import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { GeneratedSong } from '../types';

interface AudioContextType {
  currentSong: GeneratedSong | null;
  isPlaying: boolean;
  isFullPlayerOpen: boolean;
  progress: number; // 0 to 100 or seconds
  duration: number;
  playSong: (song: GeneratedSong) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setFullPlayerOpen: (isOpen: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullPlayerOpen, setFullPlayerOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
        }
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
    }
  }, []);

  const playSong = (song: GeneratedSong) => {
    if (!audioRef.current) return;

    // If it's the same song, just toggle
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }

    // New song
    const audioUrl = song.audioUrl || song.streamAudioUrl;
    if (!audioUrl) {
      console.error("No audio URL found for song", song.id);
      return;
    }

    setCurrentSong(song);
    audioRef.current.src = audioUrl;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => console.error("Playback failed", e));
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <AudioContext.Provider value={{ 
      currentSong, 
      isPlaying, 
      isFullPlayerOpen,
      progress, 
      duration, 
      playSong, 
      togglePlay, 
      seek,
      setFullPlayerOpen
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
