import { Lightbulb } from 'lucide-react';
import { courses } from '@/data/courses';
import { useProgressStore, getCourseStats } from '@/stores/progressStore';
import CourseCard from '@/components/CourseCard';

export default function CourseListPage() {
  const courseProgress = useProgressStore((s) => s.courseProgress);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">课程中心</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          共 {courses.length} 门课，从入门到中级。建议按顺序学习，每课学完再到画室完成课后练习。
        </p>
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

      <div className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50/60 p-5 text-sm dark:border-primary-500/30 dark:bg-primary-500/5">
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-primary-500" aria-hidden="true" />
        <div className="text-zinc-600 dark:text-zinc-300">
          <p className="font-bold text-zinc-800 dark:text-zinc-100">推荐学习方法</p>
          <p className="mt-1 leading-relaxed">
            先通读“讲解”建立概念 → 跟着“分步学习”每一步都在画室里动手画 →
            完成“课后练习”巩固 → 用“进度”页检查连续打卡，保持每天动手。
          </p>
        </div>
      </div>
    </div>
  );
}
