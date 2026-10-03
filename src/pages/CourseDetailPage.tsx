import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Brush,
  CheckCircle2,
  ChevronLeft,
  Circle,
  Clock,
  Download,
  PartyPopper,
  Target,
} from 'lucide-react';
import { getCourse } from '@/data/courses';
import { useProgressStore } from '@/stores/progressStore';
import { downloadSvg, svgToDataUrl } from '@/utils/image';
import { DIFFICULTY_STYLES } from '@/constants/difficulty';
import ProgressBar from '@/components/ProgressBar';

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourse(courseId) : undefined;
  const courseProgress = useProgressStore((s) => s.courseProgress);
  const visitCourse = useProgressStore((s) => s.visitCourse);
  const toggleStep = useProgressStore((s) => s.toggleStep);

  // 访问课程即记录为“最近学习”，供首页继续学习使用
  useEffect(() => {
    if (course) visitCourse(course.id);
  }, [course, visitCourse]);

  if (!course) return <Navigate to="/courses" replace />;

  const progress = courseProgress[course.id];
  const done = progress?.completedSteps.length ?? 0;
  const total = course.steps.length;
  const completed = progress?.completed ?? false;
  const stepIds = course.steps.map((s) => s.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-primary-500"
      >
        <ChevronLeft size={15} aria-hidden="true" />
        返回课程中心
      </Link>

      {/* 课程头部 */}
      <header className="mt-3 flex flex-wrap items-start gap-4">
        <span className="text-5xl" aria-hidden="true">
          {course.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black">{course.title}</h1>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[course.difficulty]}`}
            >
              {course.difficulty}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock size={12} aria-hidden="true" />
              约 {course.estimatedMinutes} 分钟
            </span>
          </div>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{course.description}</p>
          <div className="mt-3 max-w-sm">
            <div className="mb-1 flex justify-between text-xs text-zinc-400">
              <span>
                {done}/{total} 步已完成
              </span>
              <span>{total > 0 ? Math.round((done / total) * 100) : 0}%</span>
            </div>
            <ProgressBar value={total > 0 ? (done / total) * 100 : 0} ariaLabel="课程进度" />
          </div>
        </div>
      </header>

      {completed && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <PartyPopper size={20} aria-hidden="true" />
          恭喜完成本课程！记得完成课后练习，再到下一门课继续进阶。
        </div>
      )}

      {/* 学习目标 */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Target size={17} className="text-primary-500" aria-hidden="true" />
          学习目标
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {course.goals.map((goal) => (
            <li
              key={goal}
              className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
              {goal}
            </li>
          ))}
        </ul>
      </section>

      {/* 讲解 */}
      <section className="mt-8">
        <h2 className="text-base font-bold">课程讲解</h2>
        <div className="mt-3 space-y-3">
          {course.explanation.map((para, i) => (
            <p
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm leading-7 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* 分步学习 */}
      <section className="mt-8">
        <h2 className="text-base font-bold">分步学习</h2>
        <p className="mt-1 text-xs text-zinc-400">每一步都建议在画室里动手画一遍，完成后标记“已掌握”。</p>
        <ol className="mt-3 space-y-3">
          {course.steps.map((step, index) => {
            const isDone = progress?.completedSteps.includes(step.id) ?? false;
            return (
              <li
                key={step.id}
                className={`rounded-2xl border p-4 transition-colors ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                    }`}
                    aria-hidden="true"
                  >
                    {isDone ? '✓' : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {step.description}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {step.tips.map((tip) => (
                        <li
                          key={tip}
                          className="flex gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                        >
                          <span className="text-primary-400" aria-hidden="true">
                            ▸
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => toggleStep(course.id, step.id, stepIds)}
                        aria-pressed={isDone}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                          isDone
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'border border-zinc-300 text-zinc-600 hover:border-primary-400 hover:text-primary-600 dark:border-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 size={13} aria-hidden="true" />
                        ) : (
                          <Circle size={13} aria-hidden="true" />
                        )}
                        {isDone ? '已掌握' : '标记掌握'}
                      </button>
                      <Link
                        to={`/studio?ref=${course.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-600 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-zinc-600 dark:text-zinc-300"
                        aria-label={`在画室中描摹参考图，练习${step.title}`}
                      >
                        <Brush size={13} aria-hidden="true" />
                        在画室练习
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 课后练习 */}
      <section className="mt-8">
        <h2 className="text-base font-bold">课后练习</h2>
        <ul className="mt-3 space-y-2">
          {course.exercises.map((ex, i) => (
            <li
              key={ex}
              className="flex items-start gap-3 rounded-xl border border-dashed border-zinc-300 p-3.5 text-sm dark:border-zinc-700"
            >
              <span
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-500/15 dark:text-primary-400"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">{ex}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 参考图 */}
      <section className="mt-8">
        <h2 className="text-base font-bold">参考图</h2>
        <p className="mt-1 text-xs text-zinc-400">
          内置线稿，可在画室中以任意透明度垫在笔下描摹。
        </p>
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800">
          <img
            src={svgToDataUrl(course.reference.svg)}
            alt={`参考图：${course.reference.title}`}
            className="mx-auto w-full max-w-xl rounded-lg"
          />
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link
              to={`/studio?ref=${course.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              <Brush size={15} aria-hidden="true" />
              打开画室描摹
            </Link>
            <button
              onClick={() => downloadSvg(course.reference.svg, `${course.title}-参考图.svg`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-bold text-zinc-600 transition-colors hover:border-primary-400 hover:text-primary-600 dark:border-zinc-600 dark:text-zinc-300"
              aria-label={`下载参考图 ${course.reference.title}`}
            >
              <Download size={15} aria-hidden="true" />
              下载参考图
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
