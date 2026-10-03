import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface SettingsState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/** 外观设置（暗色模式等），持久化到 localStorage */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'drawmate:settings' },
  ),
);
