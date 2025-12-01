export interface Story {
  id: string;
  title: string;
  author?: string;
  description?: string;
  coverImage?: string;
  audioUrl: string;
  duration: number; // seconds
}

export const STORIES: Story[] = [
  {
    id: '1',
    title: 'The Sleepy Moon',
    author: 'Bedtime Tales',
    description: 'A gentle journey to the moon.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
    duration: 312,
    coverImage: 'https://placehold.co/400x400/1e293b/white?text=Moon'
  },
  {
    id: '2',
    title: 'Forest Whispers',
    author: 'Nature Sounds',
    description: 'Relaxing sounds from the deep forest.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    coverImage: 'https://placehold.co/400x400/064e3b/white?text=Forest'
  },
  {
    id: '3',
    title: 'Ocean Dreams',
    author: 'Blue Wave',
    description: 'Calm waves crashing on the shore.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 350,
    coverImage: 'https://placehold.co/400x400/1e40af/white?text=Ocean'
  }
];
