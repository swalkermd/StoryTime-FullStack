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
  const { stories, storiesSorted, setCurrentStoryIndex, addStories } = useAudioStore();
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
    <div className="flex flex-col h-full overflow-hidden p-4">
      <h1 className="text-3xl font-bold text-center mb-4 text-shadow-md">Story Library</h1>
      
      <div className="mb-4">
         <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-[#B8860B] text-white font-bold py-3 px-4 rounded-full hover:bg-[#DAA520] transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Processing...' : 'Add Your Stories'}
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


      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/20 border-2 border-[rgba(218,165,32,0.7)] text-[#FFFACD] placeholder-[#F5DEB3]/70 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[rgba(218,165,32,1)]"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-5 h-5 text-[#F5DEB3]/70" />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto rounded-lg bg-black/10 p-2">
        {filteredStories.length > 0 ? (
          <ul>
            {filteredStories.map((story) => (
              <li key={story.id}>
                <button
                  onClick={() => handleStoryClick(story)}
                  className="w-full text-left p-3 my-1 rounded-md hover:bg-black/20 transition-colors duration-200"
                >
                  <h3 className="font-bold text-[#FFFACD] text-lg">{story.title}</h3>
                  <p className="text-sm text-[#F5DEB3]/80">Duration: {story.duration}</p>
                </button>
              </li>
            ))}
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
