import { useAudioStore } from '../state/audioStore';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import ProgressBar from './ProgressBar';

export default function PlayerScreen() {
  const { 
    stories, 
    currentStoryIndex, 
    isPlaying,
    isLoading,
    playPause, 
    nextStory, 
    previousStory,
    swipeDirection
  } = useAudioStore();
  
  const story = stories[currentStoryIndex];

  if (!story) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading story...</p>
      </div>
    );
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipeThreshold = 50;
    const swipeVelocityThreshold = 200;

    if (offset.x > swipeThreshold || velocity.x > swipeVelocityThreshold) {
      previousStory();
    } else if (offset.x < -swipeThreshold || velocity.x < -swipeVelocityThreshold) {
      nextStory();
    }
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-10 items-center justify-between h-full p-6 lg:p-10 text-center overflow-hidden">
      <div className="flex-shrink-0" />
      
      <motion.div
        className="relative w-full aspect-square max-w-sm lg:max-w-md cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        key={currentStoryIndex}
      >
        <AnimatePresence initial={false} custom={swipeDirection}>
          <motion.div
            key={currentStoryIndex}
            custom={swipeDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex flex-col items-center justify-start"
          >
            <div className="relative w-full h-auto aspect-square rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden bg-[#0f1729] border border-[rgba(255,255,255,0.06)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.35),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.3),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(244,114,182,0.25),transparent_45%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-[0.2em] bg-white/10 border border-white/10 mb-3">
                  Now Playing
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-shadow-lg leading-tight" title={story.title}>
                  {story.title}
                </h1>
                <p className="text-sm text-[#F5DEB3]/80 mt-2">StoryTime Originals</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="w-full max-w-sm lg:max-w-md flex flex-col items-center gap-6">
        <ProgressBar />
        <div className="flex items-center justify-center gap-8 w-full">
          <button onClick={() => previousStory()} className="p-3 rounded-full transition-colors bg-white/5 hover:bg-white/10 border border-white/10" aria-label="Previous Story">
            <ChevronLeftIcon className="w-10 h-10" />
          </button>
          <button
            onClick={playPause}
            className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] rounded-full p-4 shadow-lg transition-transform hover:scale-105"
            aria-label={isPlaying ? 'Pause Story' : 'Play Story'}
          >
             {isLoading ? (
                <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
             ) : isPlaying ? (
                <PauseIcon className="w-12 h-12 text-white" />
             ) : (
                <PlayIcon className="w-12 h-12 text-white" />
             )}

          </button>
          <button onClick={() => nextStory()} className="p-3 rounded-full transition-colors bg-white/5 hover:bg-white/10 border border-white/10" aria-label="Next Story">
            <ChevronRightIcon className="w-10 h-10" />
          </button>
        </div>
        <div className="text-xs text-[#F5DEB3]/70">
          Swipe left/right on the card or use the arrows to navigate the playlist.
        </div>
      </div>
      
      <div className="flex-shrink-0 h-4"></div>
    </div>
  );
}
