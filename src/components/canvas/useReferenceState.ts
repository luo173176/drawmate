import { useState } from 'react';
import type { GridMode } from '@/types';

/** 当前生效的参考图（内置或上传） */
export interface ActiveReference {
  title: string;
  url: string;
  /** 来自内置图库时的 id，用于高亮选中项 */
  sourceId?: string;
}

/** 参考图模式共享状态：画室与练习页共用同一套交互 */
export function useReferenceState(initialActive = false) {
  const [active, setActive] = useState(initialActive);
  const [current, setCurrent] = useState<ActiveReference | null>(null);
  const [opacity, setOpacity] = useState(0.5);
  const [grid, setGrid] = useState<GridMode>('none');
  const [mirror, setMirror] = useState(false);

  return {
    active,
    setActive,
    current,
    setCurrent,
    opacity,
    setOpacity,
    grid,
    setGrid,
    mirror,
    setMirror,
  };
}
