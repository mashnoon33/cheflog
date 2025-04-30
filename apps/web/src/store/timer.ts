import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Timer {
  id: string;
  label: string;
  duration: number;
  startTime: number;
  isRunning: boolean;
  pausedAt?: number;
  remainingDuration?: number;
  recipeId: string;
}

interface TimerState {
  timers: Timer[];
  addTimer: (label: string, duration: number, recipeId: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  deleteTimer: (id: string) => void;
  getTimersForRecipe: (recipeId: string) => Timer[];
}

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timers: [],
      addTimer: (label: string, duration: number, recipeId: string) => {
        console.log('Adding timer:', { label, duration, recipeId });
        const newTimer: Timer = {
          id: Math.random().toString(36).substring(7),
          label,
          duration,
          startTime: Date.now(),
          isRunning: true,
          recipeId,
        };
        set((state) => {
          console.log('Current timers before add:', state.timers);
          const newState = {
            timers: [...state.timers, newTimer],
          };
          console.log('New state after add:', newState);
          return newState;
        });
      },
      startTimer: (id: string) => {
        console.log('Starting timer:', id);
        set((state) => {
          console.log('Current timers before start:', state.timers);
          const newState = {
            timers: state.timers.map((timer) =>
              timer.id === id
                ? { 
                    ...timer, 
                    startTime: Date.now(), 
                    isRunning: true, 
                    pausedAt: undefined,
                    remainingDuration: undefined 
                  }
                : timer
            ),
          };
          console.log('New state after start:', newState);
          return newState;
        });
      },
      pauseTimer: (id: string) => {
        console.log('Pausing timer:', id);
        set((state) => {
          const timer = state.timers.find(t => t.id === id);
          if (!timer) return state;

          const now = Date.now();
          const elapsed = now - timer.startTime;
          const remaining = Math.max(0, timer.duration - elapsed);

          console.log('Current timers before pause:', state.timers);
          const newState = {
            timers: state.timers.map((timer) =>
              timer.id === id
                ? { 
                    ...timer, 
                    isRunning: false, 
                    pausedAt: now,
                    remainingDuration: remaining 
                  }
                : timer
            ),
          };
          console.log('New state after pause:', newState);
          return newState;
        });
      },
      resumeTimer: (id: string) => {
        console.log('Resuming timer:', id);
        set((state) => {
          const timer = state.timers.find((t) => t.id === id);
          if (!timer) {
            console.log('Timer not found:', id);
            return state;
          }

          const remaining = timer.remainingDuration || timer.duration;
          const newStartTime = Date.now() - (timer.duration - remaining);

          const newState = {
            timers: state.timers.map((t) =>
              t.id === id
                ? {
                    ...t,
                    startTime: newStartTime,
                    isRunning: true,
                    pausedAt: undefined,
                    remainingDuration: undefined
                  }
                : t
            ),
          };
          console.log('New state after resume:', newState);
          return newState;
        });
      },
      stopTimer: (id: string) => {
        console.log('Stopping timer:', id);
        set((state) => {
          console.log('Current timers before stop:', state.timers);
          const newState = {
            timers: state.timers.map((timer) =>
              timer.id === id
                ? { 
                    ...timer, 
                    isRunning: false, 
                    pausedAt: undefined,
                    remainingDuration: undefined 
                  }
                : timer
            ),
          };
          console.log('New state after stop:', newState);
          return newState;
        });
      },
      deleteTimer: (id: string) => {
        console.log('Deleting timer:', id);
        set((state) => {
          console.log('Current timers before delete:', state.timers);
          const newState = {
            timers: state.timers.filter((timer) => timer.id !== id),
          };
          console.log('New state after delete:', newState);
          return newState;
        });
      },
      getTimersForRecipe: (recipeId: string) => {
        // Filter timers that match either the slug or the ID
        const timers = get().timers.filter((timer) => {
          // If the stored recipeId is a slug, it will match directly
          // If it's an ID, we need to check if it matches the current recipeId
          return timer.recipeId === recipeId;
        });
        console.log('Getting timers for recipe:', { recipeId, timers });
        return timers;
      },
    }),
    {
      name: 'recipe-timers',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
)

// Ensure the store is properly initialized on the client side
if (typeof window !== 'undefined') {
  console.log('Initializing store on client side');
  
  // Subscribe to store changes to ensure proper synchronization
  useTimerStore.subscribe(
    (state) => {
      console.log('Store state changed:', state);
      return state.timers;
    }
  );

  // Rehydrate the store
  useTimerStore.persist.rehydrate();
}

export { useTimerStore }; 