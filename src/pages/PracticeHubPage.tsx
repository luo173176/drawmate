import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PRACTICE_MODES } from '@/constants/practice';

function durationLabel(mode: (typeof PRACTICE_MODES)[number]): string {
  if (!mode.countDown || mode.defaultDuration <= 0) return '不限时';
  return mode.defaultDuration >= 60
    ? `建议时长 ${mode.defaultDuration / 60} 分钟`
    : `建议时长 ${mode.defaultDuration} 秒`;
}

export default function PracticeHubPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold">练习模式</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        每天 10–15 分钟刻意练习，比一次画 3 小时更有效。完成练习会自动计入总时长与连续打卡。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PRACTICE_MODES.map((mode) => (
          <Link
            key={mode.type}
            to={`/practice/${mode.type}`}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500/50"
            aria-label={`开始${mode.name}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl" aria-hidden="true">
                {mode.emoji}
              </span>
              <ChevronRight
                size={18}
                className="text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-400"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-3 font-bold">{mode.name}</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {mode.description}
            </p>
            <p className="mt-3 text-xs text-zinc-400">{durationLabel(mode)}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-bold">为什么要刻意练习？</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          速写练的是“抓大形”的观察力，盲画练的是手眼协调，一笔画练的是路径规划，
          临摹计时则把完整作画流程变成肌肉记忆。四种练习轮换进行，比只画完整作品进步更快。
        </p>
      </div>
    </div>
  );
}
