import { usePlayerStore } from '../state/store';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { formatTime } from '../utils/time';

export const PlayerUI = () => {
  const { currentStory, isPlaying, resume, pause, nextStory, prevStory, currentTime, duration, progress } = usePlayerStore();

  if (!currentStory) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          {/* Info */}
          <div className="flex-1">
            <h3 className="text-white font-semibold truncate">{currentStory.title}</h3>
            <p className="text-slate-400 text-sm truncate">{currentStory.author}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mx-4">
            <button onClick={prevStory} className="text-slate-300 hover:text-white transition">
              <SkipBack size={24} />
            </button>
            
            <button 
              onClick={isPlaying ? pause : resume}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            
            <button onClick={nextStory} className="text-slate-300 hover:text-white transition">
              <SkipForward size={24} />
            </button>
          </div>

          {/* Time */}
          <div className="text-xs text-slate-400 w-20 text-right font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};
