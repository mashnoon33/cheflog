"use client";
import React from 'react';
import { useTimerStore } from '@/stores/timer-store';
import { useParams } from 'next/navigation';

interface TimeBadgeProps {
  value: string;
}

interface TemperatureBadgeProps {
  value: string;
}

export function TimeBadge({ value }: TimeBadgeProps) {
  const { addTimer } = useTimerStore();
  const params = useParams();
  const recipeId = params.id as string;

  const parseTime = (timeStr: string): number | null => {
    // Match patterns like "10 hr", "4 minutes", "30 sec", etc.
    const match = timeStr.match(/^(\d+)\s*(hr|hour|min|minute|sec|second)s?$/i);
    if (!match || !match[1] || !match[2]) return null;

    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'hr':
      case 'hour':
        return amount * 60 * 60 * 1000;
      case 'min':
      case 'minute':
        return amount * 60 * 1000;
      case 'sec':
      case 'second':
        return amount * 1000;
      default:
        return null;
    }
  };

  const handleClick = () => {
    const duration = parseTime(value);
    if (duration) {
      addTimer(value, duration, recipeId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center mx-1 px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
    >
      {value}
    </button>
  );
}

export function TemperatureBadge({ value }: TemperatureBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 mx-1 py-0.5 rounded text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
      {value}
    </span>
  );
} 