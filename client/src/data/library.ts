import { STORIES as RAW_STORIES } from './stories';
import { Story } from '../types';

const formatSeconds = (value?: number): string => {
  const seconds = typeof value === 'number' && !Number.isNaN(value) ? value : 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const stories: Story[] = RAW_STORIES.map((story, idx) => ({
  id: Number(story.id) || idx + 1,
  title: story.title,
  url: story.audioUrl,
  duration: formatSeconds(story.duration),
}));

export const storiesSorted: Story[] = [...stories].sort((a, b) => a.title.localeCompare(b.title));
