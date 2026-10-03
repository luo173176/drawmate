import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import type { ToastType } from '@/stores/toastStore';

const ICONS: Record<ToastType, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
};

const STYLES: Record<ToastType, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  error:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
};

/** 全局轻提示，固定显示在底部居中 */
export default function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-8"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm shadow-lg ${STYLES[t.type]}`}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="关闭提示"
              className="ml-1 opacity-60 transition-opacity hover:opacity-100"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
