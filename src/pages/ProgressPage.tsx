import { BookOpen, Clock, Flame, Images, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { courses } from '@/data/courses';
import { useProgressStore, getCourseStats } from '@/stores/progressStore';
import { useGalleryStore } from '@/stores/galleryStore';
import { calcStreak, dateToStr } from '@/utils/dates';
import { formatDate, formatSeconds } from '@/utils/format';
import { getPracticeMode } from '@/constants/practice';
import ProgressBar from '@/components/ProgressBar';
import EmptyState from '@/components/EmptyState';
import { Link } from 'react-router-dom';

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-500/10">
        <Icon size={17} aria-hidden="true" />
      </span>
      <p className="mt-3 text-2xl font-black tabular-nums">{value}</p>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

export default function ProgressPage() {
  const courseProgress = useProgressStore((s) => s.courseProgress);
  const practices = useProgressStore((s) => s.practices);
  const activeDates = useProgressStore((s) => s.activeDates);
  const totalPracticeSeconds = useProgressStore((s) => s.totalPracticeSeconds);
  const totalPracticeCount = useProgressStore((s) => s.totalPracticeCount);
  const artworkCount = useGalleryStore((s) => s.artworks.length);

  const streak = calcStreak(activeDates);
  const completedCount = courses.filter((c) => courseProgress[c.id]?.completed).length;
  const activeSet = new Set(activeDates);

  // 最近 7 天打卡情况
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = dateToStr(d);
    return { key, label: `周${'日一二三四五六'[d.getDay()]}`, active: activeSet.has(key) };
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold">学习进度</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        所有进度保存在本地浏览器，坚持每天动手，数据会替你说话。
      </p>

      {/* 统计卡片 */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="完成课程"
          value={`${completedCount}/${courses.length}`}
          hint="标记每课全部步骤即算完成"
        />
        <StatCard icon={Clock} label="总练习时长" value={formatSeconds(totalPracticeSeconds)} />
        <StatCard
          icon={Flame}
          label="连续打卡"
          value={`${streak} 天`}
          hint={`累计练习 ${totalPracticeCount} 次`}
        />
        <StatCard icon={Images} label="画廊作品" value={`${artworkCount} 件`} />
      </div>

      {/* 最近 7 天 */}
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Trophy size={15} className="text-primary-500" aria-hidden="true" />
          最近 7 天
        </h2>
        <div className="mt-4 flex justify-between gap-2">
          {last7Days.map((day, i) => (
            <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-colors ${
                  day.active
                    ? 'bg-primary-500 text-white'
                    : 'bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600'
                }`}
                aria-label={`${day.label}${day.active ? '：已打卡' : '：未打卡'}`}
              >
                {day.active ? '✓' : ''}
              </span>
              <span
                className={`text-[11px] ${i === 6 ? 'font-bold text-primary-500' : 'text-zinc-400'}`}
              >
                {i === 6 ? '今天' : day.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 各课程进度 */}
      <section className="mt-8">
        <h2 className="text-base font-bold">课程进度</h2>
        <div className="mt-3 space-y-3">
          {courses.map((course) => {
            const stats = getCourseStats(courseProgress, course.id, course.steps.length);
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-primary-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500/50"
                aria-label={`查看课程 ${course.title} 的进度`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {course.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold">{course.title}</p>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {stats.done}/{stats.total} 步
                      {stats.completed ? ' · 已完成 🎉' : ''}
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-2"
                    value={stats.total > 0 ? (stats.done / stats.total) * 100 : 0}
                    ariaLabel={`${course.title}进度`}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 最近练习 */}
      <section className="mt-8">
        <h2 className="text-base font-bold">最近练习</h2>
        {practices.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              emoji="⏱️"
              title="还没有练习记录"
              description="完成一次速写、盲画或临摹计时，就会出现在这里。"
              action={
                <Link
                  to="/practice"
                  className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
                >
                  去练习
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {practices.slice(0, 8).map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <span className="text-lg" aria-hidden="true">
                  {getPracticeMode(p.type)?.emoji ?? '⏱️'}
                </span>
                <span className="font-medium">{getPracticeMode(p.type)?.name ?? p.type}</span>
                <span className="text-zinc-400">{formatSeconds(p.durationSec)}</span>
                <span className="ml-auto text-xs text-zinc-400">{formatDate(p.completedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
