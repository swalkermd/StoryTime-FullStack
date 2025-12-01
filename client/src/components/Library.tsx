import { STORIES } from '../data/stories';
import { usePlayerStore } from '../state/store';
import { PlayCircle, PauseCircle, Sparkles } from 'lucide-react';
import { formatTime } from '../utils/time';
import { useState } from 'react';

export const Library = () => {
  const { playStory, currentStory, isPlaying, pause, resume } = usePlayerStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-story', { method: 'POST' });
      const data = await res.json();
      alert(`Backend says: ${data.message}`);
    } catch (e) {
      alert('Failed to call backend');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 pb-32 max-w-3xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-white">Library</h1>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg font-semibold text-sm transition"
        >
          <Sparkles size={16} />
          {isGenerating ? 'Dreaming...' : 'New Story'}
        </button>
      </div>
      
      <div className="grid gap-4">
        {STORIES.map((story) => {
          const isCurrent = currentStory?.id === story.id;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div 
              key={story.id}
              className={`p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition flex items-center gap-4 group cursor-pointer ${isCurrent ? 'ring-1 ring-indigo-500 bg-slate-800' : ''}`}
              onClick={() => {
                if (isCurrent) {
                  isThisPlaying ? pause() : resume();
                } else {
                  playStory(story);
                }
              }}
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                {story.coverImage && <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />}
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition`}>
                  {isThisPlaying ? <PauseCircle className="text-white" /> : <PlayCircle className="text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-lg truncate ${isCurrent ? 'text-indigo-400' : 'text-white'}`}>
                  {story.title}
                </h3>
                <p className="text-slate-400 text-sm">{story.author}</p>
              </div>

              <div className="text-slate-500 text-sm font-mono">
                {formatTime(story.duration)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
