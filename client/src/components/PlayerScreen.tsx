import { useAudioStore } from '../state/audioStore';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import ProgressBar from './ProgressBar';
import { storyTimeLogo } from '../assets/logo';

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
    <div className="flex flex-col items-center justify-between h-full p-6 text-center overflow-hidden">
      <div className="flex-shrink-0 h-10"></div>
      
      <motion.div
        className="relative w-full aspect-square max-w-sm cursor-grab active:cursor-grabbing"
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
            <div className="relative w-full h-auto aspect-square rounded-2xl shadow-2xl overflow-hidden bg-gray-800/50">
                <img
                    src={storyTimeLogo}
                    alt="Story Time"
                    className="w-full h-full object-cover"
                />
                 <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            <div className="mt-6 w-full">
              <h1 className="text-3xl font-bold text-shadow-lg truncate" title={story.title}>{story.title}</h1>
              <p className="text-lg text-[#F5DEB3] opacity-80 mt-1">Story Time Classics</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <ProgressBar />
        <div className="flex items-center justify-center gap-8 w-full">
          <button onClick={() => previousStory()} className="p-2 rounded-full transition-colors hover:bg-white/10" aria-label="Previous Story">
            <ChevronLeftIcon className="w-10 h-10" />
          </button>
          <button
            onClick={playPause}
            className="bg-[#B8860B] rounded-full p-4 shadow-lg transition-transform hover:scale-105"
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
          <button onClick={() => nextStory()} className="p-2 rounded-full transition-colors hover:bg-white/10" aria-label="Next Story">
            <ChevronRightIcon className="w-10 h-10" />
          </button>
        </div>
      </div>
      
      <div className="flex-shrink-0 h-4"></div>
    </div>
  );
}
