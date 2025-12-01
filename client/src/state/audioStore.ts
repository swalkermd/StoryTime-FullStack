import { create } from 'zustand';
import { AudioActions, AudioState, Story } from '../types';
import { formatTime } from '../utils/time';

export const useAudioStore = create<AudioState & AudioActions>((set, get) => ({
  stories: [],
  storiesSorted: [],
  currentStoryIndex: 0,
  isPlaying: false,
  isLoading: true,
  playbackStatus: { positionMillis: 0, durationMillis: 0 },
  swipeDirection: 1,

  setStories: (stories, storiesSorted) => set({ stories, storiesSorted }),

  setCurrentStoryIndex: (index, play) => {
    const { stories, currentStoryIndex } = get();
    if (index >= 0 && index < stories.length) {
      if (index !== currentStoryIndex) {
        set({
          currentStoryIndex: index,
          isPlaying: play,
          isLoading: true,
          playbackStatus: { positionMillis: 0, durationMillis: 0 },
        });
      } else if (play) {
        set({ isPlaying: true });
      }
    }
  },

  playPause: () => {
    const { isPlaying, playbackStatus } = get();
    // Restart track if already at end.
    if (playbackStatus.positionMillis > 0 && playbackStatus.positionMillis >= playbackStatus.durationMillis - 100) {
      set({ playbackStatus: { ...playbackStatus, positionMillis: 0 } });
    }
    set({ isPlaying: !isPlaying });
  },

  nextStory: (shouldPlay = true) => {
    const { currentStoryIndex, stories } = get();
    const nextIndex = (currentStoryIndex + 1) % stories.length;
    set({
      currentStoryIndex: nextIndex,
      isPlaying: shouldPlay,
      isLoading: true,
      playbackStatus: { positionMillis: 0, durationMillis: 0 },
      swipeDirection: 1,
    });
  },

  previousStory: (shouldPlay = true) => {
    const { currentStoryIndex, stories } = get();
    const prevIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
    set({
      currentStoryIndex: prevIndex,
      isPlaying: shouldPlay,
      isLoading: true,
      playbackStatus: { positionMillis: 0, durationMillis: 0 },
      swipeDirection: -1,
    });
  },
  
  addStories: (newStories: Story[]) => {
    const { stories } = get();
    const updatedStories = [...stories, ...newStories];
    const updatedStoriesSorted = [...updatedStories].sort((a, b) => a.title.localeCompare(b.title));
    set({ stories: updatedStories, storiesSorted: updatedStoriesSorted });
  },

  setStoryDuration: (id: number, durationSeconds: number) => {
    set((state) => {
      const format = formatTime(durationSeconds);
      const update = (list: Story[]) =>
        list.map((s) => (s.id === id ? { ...s, durationSeconds, duration: format } : s));
      return {
        stories: update(state.stories),
        storiesSorted: update(state.storiesSorted),
      };
    });
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setPlaybackStatus: (status) => set({ playbackStatus: status }),
})); 
