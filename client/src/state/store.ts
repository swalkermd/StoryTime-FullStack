import { create } from 'zustand';
import { Story, STORIES } from '../data/stories';

interface PlayerState {
  currentStory: Story | null;
  isPlaying: boolean;
  progress: number; // 0 to 100
  currentTime: number;
  duration: number;
  
  // Actions
  playStory: (story: Story) => void;
  pause: () => void;
  resume: () => void;
  setTime: (time: number) => void;
  setDuration: (duration: number) => void;
  nextStory: () => void;
  prevStory: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentStory: null,
  isPlaying: false,
  progress: 0,
  currentTime: 0,
  duration: 0,

  playStory: (story) => set({ currentStory: story, isPlaying: true, currentTime: 0 }),
  
  pause: () => set({ isPlaying: false }),
  
  resume: () => set({ isPlaying: true }),
  
  setTime: (time) => set((state) => ({ 
    currentTime: time, 
    progress: state.duration > 0 ? (time / state.duration) * 100 : 0 
  })),
  
  setDuration: (duration) => set({ duration }),
  
  nextStory: () => {
    const { currentStory } = get();
    if (!currentStory) return;
    const idx = STORIES.findIndex(s => s.id === currentStory.id);
    if (idx < STORIES.length - 1) {
      set({ currentStory: STORIES[idx + 1], isPlaying: true, currentTime: 0 });
    }
  },
  
  prevStory: () => {
    const { currentStory } = get();
    if (!currentStory) return;
    const idx = STORIES.findIndex(s => s.id === currentStory.id);
    if (idx > 0) {
      set({ currentStory: STORIES[idx - 1], isPlaying: true, currentTime: 0 });
    }
  }
}));
