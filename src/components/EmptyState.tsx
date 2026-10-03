import type { ReactNode } from 'react';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description?: string;
  /** 底部操作区（按钮/链接） */
  action?: ReactNode;
}

/** 空状态占位 */
export default function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-14 text-center dark:border-zinc-700">
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h3 className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-200">{title}</h3>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
