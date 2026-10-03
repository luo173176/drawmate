import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import type { Course } from '@/types';
import { DIFFICULTY_STYLES } from '@/constants/difficulty';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  done: number;
  total: number;
  completed: boolean;
}

/** 课程卡片：课程列表页与首页共用 */
export default function CourseCard({ course, done, total, completed }: CourseCardProps) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500/50"
      aria-label={`进入课程：${course.title}（${done}/${total} 步已完成）`}
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl" aria-hidden="true">
          {course.emoji}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[course.difficulty]}`}
        >
          {course.difficulty}
        </span>
      </div>

      <h3 className="mt-3 text-base font-bold">{course.title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{course.subtitle}</p>

      <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />约 {course.estimatedMinutes} 分钟
        </span>
        {completed && <span className="font-medium text-emerald-500">✓ 已完成</span>}
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-zinc-400">
          <span>
            {done}/{total} 步
          </span>
          <span>{total > 0 ? Math.round((done / total) * 100) : 0}%</span>
        </div>
        <ProgressBar
          value={total > 0 ? (done / total) * 100 : 0}
          ariaLabel={`${course.title}学习进度`}
        />
      </div>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400">
        {done > 0 && !completed ? '继续学习' : completed ? '复习课程' : '开始学习'}
        <ChevronRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
