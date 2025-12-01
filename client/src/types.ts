export interface Story {
  id: number;
  title: string;
  url: string;
  duration: string; // formatted mm:ss
  durationSeconds?: number;
}

export interface PlaybackStatus {
  positionMillis: number;
  durationMillis: number;
}

export interface AudioState {
  stories: Story[];
  storiesSorted: Story[];
  currentStoryIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  playbackStatus: PlaybackStatus;
  swipeDirection: number;
  playbackError?: string;
}

export interface AudioActions {
  setStories: (stories: Story[], storiesSorted: Story[]) => void;
  setCurrentStoryIndex: (index: number, play: boolean) => void;
  playPause: () => void;
  nextStory: (shouldPlay?: boolean) => void;
  previousStory: (shouldPlay?: boolean) => void;
  setStoryDuration: (id: number, durationSeconds: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setPlaybackStatus: (status: PlaybackStatus) => void;
  addStories: (newStories: Story[]) => void;
  setPlaybackError: (message?: string) => void;
}
