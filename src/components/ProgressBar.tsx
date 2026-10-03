interface ProgressBarProps {
  /** 0 - 100 */
  value: number;
  className?: string;
  ariaLabel?: string;
}

/** 细进度条 */
export default function ProgressBar({ value, className = '', ariaLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={`h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 ${className}`}
    >
      <div
        className="h-full rounded-full bg-primary-500 transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
