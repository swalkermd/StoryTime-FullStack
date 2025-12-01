import { useState, useRef, useEffect, useCallback } from 'react';
import PlayerScreen from './components/PlayerScreen';
import LibraryScreen from './components/LibraryScreen';
import { useAudioStore } from './state/audioStore';
import { stories, storiesSorted } from './data/library';
import { LibraryIcon, PlayerTabIcon } from './components/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Wifi } from 'lucide-react';

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
    setStoryDuration,
    setPlaybackError,
    playbackError,
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
      const current = storeStories[currentStoryIndex];
      if (current) {
        setStoryDuration(current.id, audioRef.current.duration);
      }
    }
  }, [setPlaybackStatus, setIsLoading, setStoryDuration, storeStories, currentStoryIndex]);

  const onError = useCallback(() => {
    setIsLoading(false);
    setIsPlaying(false);
    setPlaybackError('Playback failed. Try again or choose another story.');
  }, [setIsLoading, setIsPlaying, setPlaybackError]);

  const onEnded = useCallback(() => {
    nextStory(true);
  }, [nextStory]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      return () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
      };
    }
  }, [onTimeUpdate, onLoadedMetadata, onEnded, onError]);

  useEffect(() => {
    const story = storeStories[currentStoryIndex];
    const audio = audioRef.current;
    
    if (audio && story) {
        // quick availability check
        fetch(story.url, { method: 'HEAD' })
          .then((res) => {
            if (!res.ok) throw new Error('Unavailable');
          })
          .catch(() => {
            setPlaybackError('Could not load this story. Please try another.');
          });

        if (!audio.src.endsWith(story.url)) {
            audio.src = story.url;
            audio.load();
            setIsLoading(true);
            setPlaybackError(undefined);
        }

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Error playing audio:", error);
                setIsPlaying(false);
                setPlaybackError('Playback was blocked. Tap play again or choose another story.');
              });
            }
        } else {
            audio.pause();
        }
    }
  }, [currentStoryIndex, isPlaying, setIsPlaying, setIsLoading, setPlaybackError, storeStories]);

  return (
    <div 
      className="app-shell min-h-screen w-screen overflow-hidden flex text-white bg-[#05070d]"
    >
      <div className="app-backdrop" />
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" />
      <div className="app-frame max-w-6xl w-full mx-auto h-screen flex flex-col lg:flex-row overflow-hidden">
        <header className="app-header">
          <div className="brand">
            <span className="brand-mark">ST</span>
            <div>
              <div className="brand-title">StoryTime</div>
              <div className="brand-subtitle">304 audio adventures</div>
            </div>
          </div>
          <div className="header-stats">
            <span className="pill">
              <Wifi size={14} className="mr-2" />
              Streaming
            </span>
            <span className="pill pill-ghost">{storeStories.length || 0} tracks</span>
          </div>
        </header>
        {playbackError && (
          <div className="mx-4 lg:mx-6 mb-3 px-3 py-2 rounded-xl bg-[#F97316]/15 border border-[#F97316]/35 text-sm text-[#FFD7B5] flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{playbackError}</span>
          </div>
        )}

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
