import { create } from 'zustand'

const SCALE_STORAGE_KEY = 'recipe-scales';

interface RecipeScales {
  [recipeId: string]: number;
}

function getInitialScales(): RecipeScales {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(SCALE_STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {}
  return {};
}

interface ScaleState {
  scales: RecipeScales
  showScaler: boolean
  setScale: (recipeId: string, scale: number) => void
  getScale: (recipeId: string) => number
  getShowScaler: (recipeId: string) => boolean
  setShowScaler: (show: boolean) => void
  toggleScaler: () => void
}

export const useScaleStore = create<ScaleState>((set, get) => {
  const initialScales = typeof window === 'undefined' ? {} : getInitialScales();

  return {
    scales: initialScales,
    showScaler: false,
    setScale: (recipeId, scale) => {
      const newScales = { ...get().scales };
      if (scale !== 1) {
        newScales[recipeId] = scale;
      } else {
        delete newScales[recipeId];
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(SCALE_STORAGE_KEY, JSON.stringify(newScales));
      }
      
      set({ scales: newScales });
    },
    getScale: (recipeId) => get().scales[recipeId] ?? 1,
    getShowScaler: (recipeId) => {
      const scale = get().scales[recipeId];
      const showScaler = get().showScaler;
      return showScaler || (scale !== undefined && scale !== 1);
    },
    setShowScaler: (show) => {
      console.log('setShowScaler called:', { show });
      set({ showScaler: show });
    },
    toggleScaler: () => {
      const currentState = get().showScaler;
      console.log('toggleScaler called:', { currentState, newState: !currentState });
      set((state) => ({ showScaler: !state.showScaler }));
    },
  };
});