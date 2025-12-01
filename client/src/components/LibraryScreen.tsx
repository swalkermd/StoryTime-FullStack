import React, { useState, useMemo, useRef } from 'react';
import { useAudioStore } from '../state/audioStore';
import { Story } from '../types';
import { SearchIcon } from './icons';

interface LibraryScreenProps {
  onStorySelect: () => void;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function LibraryScreen({ onStorySelect }: LibraryScreenProps) {
  const { stories, storiesSorted, setCurrentStoryIndex, addStories, currentStoryIndex, isPlaying } = useAudioStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStories = useMemo(() => {
    if (!searchTerm) {
      return storiesSorted;
    }
    return storiesSorted.filter(story =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [storiesSorted, searchTerm]);
  
  const handleStoryClick = (story: Story) => {
    const originalIndex = stories.findIndex(s => s.id === story.id);
    if (originalIndex !== -1) {
      setCurrentStoryIndex(originalIndex, true);
      onStorySelect();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const newStoriesPromises = Array.from(files).map((file: File) => {
      return new Promise<Story>((resolve, reject) => {
        const media = document.createElement('video');
        const objectUrl = URL.createObjectURL(file);
        media.src = objectUrl;

        media.addEventListener('loadedmetadata', () => {
          const newStory: Story = {
            id: Date.now() + Math.random(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: media.src,
            duration: formatDuration(media.duration),
          };
          resolve(newStory);
        });

        media.addEventListener('error', (e) => {
          URL.revokeObjectURL(objectUrl);
          console.error(`Error loading file: ${file.name}`, e);
          reject(file.name);
        });
      });
    });

    const results = await Promise.allSettled(newStoriesPromises);
    const successfulStories: Story[] = [];
    const failedFileNames: string[] = [];

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            successfulStories.push(result.value);
        } else {
            failedFileNames.push(result.reason);
        }
    });
    
    if(successfulStories.length > 0) {
        addStories(successfulStories);
    }

    if(failedFileNames.length > 0) {
        alert(`Could not process the following files: ${failedFileNames.join(', ')}. Please ensure they are a supported audio or video format.`);
    }

    setIsUploading(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 lg:p-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-4 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Library</p>
            <h1 className="text-2xl font-bold text-shadow-md">Browse all stories</h1>
            <p className="text-sm text-white/70">{storiesSorted.length} tracks · Tap to play</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Processing…' : 'Add Your Stories'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="audio/*,video/*"
              className="hidden"
            />
          </div>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-[#FFFACD] placeholder-white/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="w-5 h-5 text-white/60" />
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto rounded-2xl bg-white/5 border border-white/10 p-2 lg:p-3 space-y-2">
        {filteredStories.length > 0 ? (
          <ul className="space-y-2">
            {filteredStories.map((story) => {
              const isCurrent = stories[currentStoryIndex]?.id === story.id;
              return (
                <li key={story.id}>
                  <button
                    onClick={() => handleStoryClick(story)}
                    className={`w-full text-left p-3 lg:p-4 rounded-xl transition-all duration-200 border border-white/5 bg-white/5 hover:bg-white/10 ${isCurrent ? 'ring-1 ring-white/40' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#FFFACD] text-base lg:text-lg truncate" title={story.title}>{story.title}</h3>
                        <p className="text-xs text-white/60 mt-1">Duration: {story.duration}</p>
                      </div>
                      {isCurrent && (
                        <span className="px-3 py-1 text-[11px] rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white shadow">
                          {isPlaying ? 'Playing' : 'Paused'}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-[#F5DEB3]/80">
            <p>No stories found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
