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
    stories: storeStories,
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
    const story = storeStories[currentStoryIndex];
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
      className="app-shell min-h-screen w-screen overflow-hidden flex text-[#FFFACD] bg-gradient-to-br from-[#1A0F16] via-[#1d1628] to-[#0f1b2e]"
    >
      <div className="app-backdrop" />
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />
      <div className="app-frame max-w-5xl w-full mx-auto h-screen flex flex-col lg:flex-row overflow-hidden">
        <div className="app-header">
          <div className="brand">
            <span className="brand-mark">ST</span>
            <div>
              <div className="brand-title">StoryTime</div>
              <div className="brand-subtitle">304 audio adventures</div>
            </div>
          </div>
          <div className="header-stats">
            <span className="pill">Playlist</span>
            <span className="pill pill-ghost">{storeStories.length || 0} tracks</span>
          </div>
        </div>

        <main className="flex-grow flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'player' && (
              <motion.div
                key="player"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <PlayerScreen />
              </motion.div>
            )}
            {view === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <LibraryScreen onStorySelect={() => setView('player')} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <nav className="tab-nav flex-shrink-0 backdrop-blur-md border-t border-t-[rgba(255,255,255,0.08)] lg:border-t-0 lg:border-l lg:border-l-[rgba(255,255,255,0.08)]">
          <div className="tab-nav__inner flex justify-around items-center h-16 lg:h-full lg:flex-col lg:justify-center lg:gap-4">
            <button
              onClick={() => setView('player')}
              className={`tab-btn ${view === 'player' ? 'tab-btn--active' : ''}`}
            >
              <PlayerTabIcon className="w-6 h-6" />
              <span>Player</span>
            </button>
            <button
              onClick={() => setView('library')}
              className={`tab-btn ${view === 'library' ? 'tab-btn--active' : ''}`}
            >
              <LibraryIcon className="w-6 h-6" />
              <span>Library</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
