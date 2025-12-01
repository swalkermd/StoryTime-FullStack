import { useAudioStore } from '../state/audioStore';

export default function ProgressBar() {
  const { playbackStatus } = useAudioStore();
  const { positionMillis, durationMillis } = playbackStatus;

  const formatTime = (millis: number) => {
    if (isNaN(millis) || millis === 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;

  return (
    <div className="w-full">
      <div className="w-full bg-black/30 rounded-full h-2">
        <div
          className="bg-[#B8860B] h-2 rounded-full"
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-[#F5DEB3] mt-1 px-1">
        <span>{formatTime(positionMillis)}</span>
        <span>{formatTime(durationMillis)}</span>
      </div>
    </div>
  );
}
