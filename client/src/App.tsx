import { useState, useRef, useEffect, useCallback } from 'react';
import PlayerScreen from './components/PlayerScreen';
import LibraryScreen from './components/LibraryScreen';
import { useAudioStore } from './state/audioStore';
import { stories, storiesSorted } from './data/library';
import { LibraryIcon, PlayerTabIcon } from './components/icons';
import { AnimatePresence, motion } from 'framer-motion';

type View = 'player' | 'library';

function App() {
  const [view, setView] = useState<View>('player');
  const { 
    setStories, 
    setIsPlaying, 
    setPlaybackStatus, 
    currentStoryIndex, 
    isPlaying, 
    nextStory,
    setIsLoading,
  } = useAudioStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setStories(stories, storiesSorted);
  }, [setStories]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setPlaybackStatus({
        positionMillis: audioRef.current.currentTime * 1000,
        durationMillis: audioRef.current.duration * 1000,
      });
    }
  }, [setPlaybackStatus]);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setPlaybackStatus({
        positionMillis: audioRef.current.currentTime * 1000,
        durationMillis: audioRef.current.duration * 1000,
      });
      setIsLoading(false);
    }
  }, [setPlaybackStatus, setIsLoading]);

  const onEnded = useCallback(() => {
    nextStory(true);
  }, [nextStory]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('ended', onEnded);
      };
    }
  }, [onTimeUpdate, onLoadedMetadata, onEnded]);

  useEffect(() => {
    const story = stories[currentStoryIndex];
    const audio = audioRef.current;
    
    if (audio && story) {
        if (!audio.src.endsWith(story.url)) {
            audio.src = story.url;
            audio.load();
        }

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Error playing audio:", error);
                setIsPlaying(false);
              });
            }
        } else {
            audio.pause();
        }
    }
  }, [currentStoryIndex, isPlaying, setIsPlaying]);

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col text-[#FFFACD] bg-[#6b4226]" 
      style={{ backgroundImage: 'radial-gradient(ellipse at center, #CD853F 0%, #8B4513 50%, #6b4226 100%)' }}
    >
      <audio ref={audioRef} />
      <main className="flex-grow flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'player' && (
              <motion.div
                key="player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <PlayerScreen />
              </motion.div>
            )}
            {view === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <LibraryScreen onStorySelect={() => setView('player')} />
              </motion.div>
            )}
          </AnimatePresence>
      </main>

      <nav className="flex-shrink-0 bg-[#3A220F]/50 backdrop-blur-md border-t border-t-[rgba(218,165,32,0.3)]">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setView('player')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${view === 'player' ? 'text-white' : 'text-[#FFFACD]/60 hover:text-white'}`}
          >
            <PlayerTabIcon className="w-6 h-6" />
            <span className="text-xs tracking-wider font-sans">Player</span>
          </button>
          <button
            onClick={() => setView('library')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${view === 'library' ? 'text-white' : 'text-[#FFFACD]/60 hover:text-white'}`}
          >
            <LibraryIcon className="w-6 h-6" />
            <span className="text-xs tracking-wider font-sans">Library</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
