import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BRUSH_COLORS } from '@/constants/colors';

export type Tool = 'brush' | 'eraser';

interface BrushState {
  tool: Tool;
  color: string;
  /** 笔刷基础大小（px，画布逻辑分辨率下） */
  size: number;
  /** 笔刷不透明度 0.05 - 1 */
  opacity: number;
  /** 手写笔压感开关（预留接口：pointerType === 'pen' 时按 pressure 缩放线宽） */
  pressureEnabled: boolean;
  /** 最近使用的颜色 */
  recentColors: string[];
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setOpacity: (opacity: number) => void;
  setPressureEnabled: (enabled: boolean) => void;
}

/** 画笔参数，持久化以便下次打开画室沿用 */
export const useBrushStore = create<BrushState>()(
  persist(
    (set) => ({
      tool: 'brush',
      color: BRUSH_COLORS[0],
      size: 6,
      opacity: 1,
      pressureEnabled: true,
      recentColors: [],
      setTool: (tool) => set({ tool }),
      setColor: (color) =>
        set((s) => ({
          color,
          recentColors: [color, ...s.recentColors.filter((c) => c !== color)].slice(0, 6),
        })),
      setSize: (size) => set({ size }),
      setOpacity: (opacity) => set({ opacity }),
      setPressureEnabled: (pressureEnabled) => set({ pressureEnabled }),
    }),
    { name: 'drawmate:brush' },
  ),
);
