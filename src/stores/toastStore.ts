import { create } from 'zustand';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, type?: ToastType) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

/** 轻量全局提示 */
export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, type = 'info') => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    window.setTimeout(() => get().dismiss(id), 2600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/** 便捷调用：组件外也可使用 */
export function toast(message: string, type: ToastType = 'info'): void {
  useToastStore.getState().show(message, type);
}
