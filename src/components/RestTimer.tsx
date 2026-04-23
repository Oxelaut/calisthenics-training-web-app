import { useEffect, useRef, useState } from 'react';
import { playRestComplete, playTick } from '../utils/sound';

interface Props {
  duration: number; // seconds
  onComplete: () => void;
  onSkip: () => void;
}

export default function RestTimer({ duration, onComplete, onSkip }: Props) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setRemaining(duration);

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          if (!completedRef.current) {
            completedRef.current = true;
            playRestComplete();
            setTimeout(onComplete, 400);
          }
          return 0;
        }
        if (prev <= 4) playTick();
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  const pct = ((duration - remaining) / duration) * 100;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const timeStr = `${mins > 0 ? `${mins}:` : ''}${String(secs).padStart(2, '0')}`;

  const color = remaining > duration * 0.5
    ? '#4ade80'
    : remaining > duration * 0.25
      ? '#facc15'
      : '#f87171';

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Rest Timer</p>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background track */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white tabular-nums">{timeStr}</span>
          <span className="text-xs text-zinc-500 mt-0.5">seconds left</span>
        </div>
      </div>
      <button
        onClick={onSkip}
        className="px-6 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm font-medium transition-colors"
      >
        Skip Rest
      </button>
    </div>
  );
}
