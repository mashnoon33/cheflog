"use client";

import React, { useEffect } from 'react';
import { useTimerStore } from '@/store/timer';
import { Timer as TimerComponent } from '@/components/ui/timer';
import type { Timer } from '@/store/timer';

interface TimersProps {
  recipeId: string;
}

export function Timers({ recipeId }: TimersProps) {
  const { getTimersForRecipe, startTimer, pauseTimer, resumeTimer, stopTimer, deleteTimer } = useTimerStore();
  const [timers, setTimers] = React.useState<Timer[]>([]);

  // Subscribe to store changes
  useEffect(() => {
    // Initial load
    setTimers(getTimersForRecipe(recipeId));

    // Subscribe to store changes
    const unsubscribe = useTimerStore.subscribe(
      (state) => {
        console.log('Timers component received store update:', state);
        setTimers(state.timers.filter(timer => timer.recipeId === recipeId));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [recipeId, getTimersForRecipe]);

  if (timers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {timers.map((timer) => (
        <TimerComponent
          key={timer.id}
          id={timer.id}
          label={timer.label}
          duration={timer.duration}
          startTime={timer.startTime}
          isRunning={timer.isRunning}
          remainingDuration={timer.remainingDuration}
          onStop={stopTimer}
          onPause={pauseTimer}
          onResume={resumeTimer}
          onDelete={deleteTimer}
        />
      ))}
    </div>
  );
} 