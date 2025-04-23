"use client"
import React from 'react';
import { Timer as TimerIcon, Pause, Play, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { ActionContainer } from './floating-action-button';
interface TimerProps {
  id: string;
  label: string;
  duration: number;
  startTime: number;
  onStop: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
  isRunning: boolean;
  remainingDuration?: number;
}

export function Timer({
  id,
  label,
  duration,
  startTime,
  onStop,
  onPause,
  onResume,
  onDelete,
  isRunning,
  remainingDuration,
}: TimerProps) {
  const [displayTime, setDisplayTime] = React.useState<string>('');

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const updateDisplayTime = () => {
      let remaining: number;
      if (isRunning) {
        remaining = Math.max(0, duration - (Date.now() - startTime));
      } else if (typeof remainingDuration === 'number') {
        // Use the store's remainingDuration when paused
        remaining = remainingDuration;
      } else {
        // Fallback to duration if no remainingDuration is set
        remaining = duration;
      }

      if (remaining <= 0) {
        onStop(id);
        return;
      }

      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

      const newDisplayTime = hours > 0
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;

      setDisplayTime(newDisplayTime);
    };

    if (isRunning) {
      updateDisplayTime();
      interval = setInterval(updateDisplayTime, 1000);
    } else {
      // Only update once for paused timers
      updateDisplayTime();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, duration, startTime, id, onStop, remainingDuration]);

  return (
    <ActionContainer className="text-white">
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <TimerIcon className="h-4 w-4 text-neutral-400" />
          <div className="flex flex-col ml-2">
            <span className="text-lg font-bold">{displayTime}</span>

            <span className="text-xs text-neutral-400 font-medium">{label}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isRunning ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPause(id)}
              className="h-8 w-8 p-0"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResume(id)}
              className="h-8 w-8 p-0"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </ActionContainer>
  );
} 