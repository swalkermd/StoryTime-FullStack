import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../state/store';

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentStory, isPlaying, setTime, setDuration, nextStory } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentStory) {
      if (audio.src !== currentStory.audioUrl) {
        audio.src = currentStory.audioUrl;
        audio.load();
      }
      
      if (isPlaying) {
        audio.play().catch(e => console.error("Playback failed", e));
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentStory, isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    nextStory();
  };

  return (
    <audio 
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      className="hidden" 
    />
  );
};
