import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Heart,
  Images,
  Palette,
  PenTool,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { courses } from '@/data/courses';
import { PRACTICE_MODES } from '@/constants/practice';
import { useProgressStore, getCourseStats } from '@/stores/progressStore';
import { useGalleryStore } from '@/stores/galleryStore';
import { calcStreak } from '@/utils/dates';
import CourseCard from '@/components/CourseCard';
import ProgressBar from '@/components/ProgressBar';

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: BookOpen, title: '系统课程', description: '从线条到头像，6 门课循序渐进' },
  { icon: PenTool, title: '多输入方式', description: '鼠标、触控、手写笔都能画' },
  { icon: ShieldCheck, title: '数据本地保存', description: '无需注册登录，隐私安全' },
  { icon: Heart, title: '免费开源', description: 'MIT 协议，可自由使用与修改' },
];

export default function HomePage() {
  const courseProgress = useProgressStore((s) => s.courseProgress);
  const lastCourseId = useProgressStore((s) => s.lastCourseId);
  const activeDates = useProgressStore((s) => s.activeDates);
  const artworkCount = useGalleryStore((s) => s.artworks.length);

  const streak = calcStreak(activeDates);
  const completedCount = courses.filter((c) => courseProgress[c.id]?.completed).length;

  // 继续学习：优先上次学到一半的课程，否则推荐第一门未完成的
  const continueTarget =
    courses.find((c) => c.id === lastCourseId && !courseProgress[c.id]?.completed) ??
    courses.find((c) => !courseProgress[c.id]?.completed) ??
    courses[0];
  const continueStats = getCourseStats(
    courseProgress,
    continueTarget.id,
    continueTarget.steps.length,
  );

  // 每日练习建议：按日期轮换练习模式
  const dailyMode = PRACTICE_MODES[new Date().getDate() % PRACTICE_MODES.length];

  return (
    <div className="space-y-10">
      {/* Hero 区 */}
      <section className="rounded-3xl bg-gradient-to-br from-primary-50 via-orange-50 to-sky-50 p-8 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 sm:p-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
            DrawMate · 画伴
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            学画画，
            <br className="hidden sm:block" />
            从每天 15 分钟开始
          </h1>
          <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-300">
            画伴是为零基础到进阶学习者设计的绘画练习伙伴：系统的分步课程、随时可用的绘画画布、
            科学的练习模式，以及看得见的进步追踪。不需要安装、不需要注册，打开就能画。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary-600"
            >
              开始系统学习
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/studio"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white/70 px-5 py-2.5 text-sm font-bold transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-zinc-600 dark:bg-zinc-800/70"
            >
              <Palette size={16} aria-hidden="true" />
              打开画室
            </Link>
            <Link
              to={`/practice/${dailyMode.type}`}
              className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-zinc-600 transition-colors hover:bg-white/60 hover:text-primary-600 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <Timer size={16} aria-hidden="true" />
              今日练习：{dailyMode.name}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <BookOpen size={15} className="text-primary-500" aria-hidden="true" />
              已完成 {completedCount}/{courses.length} 门课程
            </span>
            <span className="flex items-center gap-1.5">
              <Flame size={15} className="text-primary-500" aria-hidden="true" />
              连续练习 {streak} 天
            </span>
            <span className="flex items-center gap-1.5">
              <Images size={15} className="text-primary-500" aria-hidden="true" />
              画廊 {artworkCount} 件作品
            </span>
          </div>
        </div>
      </section>

      {/* 继续学习 + 每日练习 */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">
            <BookOpen size={15} aria-hidden="true" />
            继续学习
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {continueTarget.emoji}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-bold">{continueTarget.title}</h3>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                {continueTarget.subtitle}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-zinc-400">
              <span>
                {continueStats.done}/{continueStats.total} 步已完成
              </span>
              <span>
                {continueStats.total > 0
                  ? Math.round((continueStats.done / continueStats.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <ProgressBar
              value={
                continueStats.total > 0 ? (continueStats.done / continueStats.total) * 100 : 0
              }
              ariaLabel="继续学习进度"
            />
          </div>
          <Link
            to={`/course/${continueTarget.id}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
          >
            {continueStats.done > 0 ? '继续这门课' : '从这门课开始'}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">
            <Flame size={15} aria-hidden="true" />
            每日练习
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {dailyMode.emoji}
            </span>
            <div>
              <h3 className="font-bold">{dailyMode.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{dailyMode.description}</p>
            </div>
          </div>
          <ul className="mt-4 flex-1 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-300">
            {dailyMode.howTo.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary-500" aria-hidden="true">
                  ·
                </span>
                {tip}
              </li>
            ))}
          </ul>
          <Link
            to={`/practice/${dailyMode.type}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary-300 py-2.5 text-sm font-bold text-primary-600 transition-colors hover:bg-primary-50 dark:border-primary-500/50 dark:hover:bg-primary-500/10"
          >
            <Timer size={15} aria-hidden="true" />
            开始今日练习
          </Link>
        </div>
      </section>

      {/* 课程列表 */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold">全部课程</h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              按顺序学习效果最佳，每课约 {Math.round(
                courses.reduce((sum, c) => sum + c.estimatedMinutes, 0) / courses.length,
              )}{' '}
              分钟
            </p>
          </div>
          <Link
            to="/courses"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400 sm:inline-flex"
          >
            课程中心
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const stats = getCourseStats(courseProgress, course.id, course.steps.length);
            return (
              <CourseCard
                key={course.id}
                course={course}
                done={stats.done}
                total={stats.total}
                completed={stats.completed}
              />
            );
          })}
        </div>
      </section>

      {/* 特性 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-500/10">
              <f.icon size={17} aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-sm font-bold">{f.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {f.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
