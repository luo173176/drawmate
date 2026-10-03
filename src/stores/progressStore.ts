import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CourseProgress, PracticeRecord, PracticeType } from '@/types';
import { todayStr } from '@/utils/dates';
import { generateId } from '@/utils/id';

interface ProgressState {
  courseProgress: Record<string, CourseProgress>;
  /** 最近练习记录（仅保留最近 100 条用于展示） */
  practices: PracticeRecord[];
  /** 打卡过的日期（YYYY-MM-DD），用于连续天数统计 */
  activeDates: string[];
  /** 累计练习秒数（独立累计，不受记录条数上限影响） */
  totalPracticeSeconds: number;
  totalPracticeCount: number;
  /** 最近学习的课程 id（首页“继续学习”） */
  lastCourseId: string | null;
  visitCourse: (courseId: string) => void;
  /** 切换某步骤的“已掌握”状态，并据此更新课程完成状态 */
  toggleStep: (courseId: string, stepId: string, allStepIds: string[]) => void;
  addPractice: (type: PracticeType, durationSec: number) => void;
  markActive: () => void;
}

/** 学习与练习进度，持久化到 localStorage */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      courseProgress: {},
      practices: [],
      activeDates: [],
      totalPracticeSeconds: 0,
      totalPracticeCount: 0,
      lastCourseId: null,

      visitCourse: (courseId) => set({ lastCourseId: courseId }),

      toggleStep: (courseId, stepId, allStepIds) =>
        set((s) => {
          const prev: CourseProgress =
            s.courseProgress[courseId] ?? { completedSteps: [], completed: false, updatedAt: 0 };
          const has = prev.completedSteps.includes(stepId);
          const completedSteps = has
            ? prev.completedSteps.filter((id) => id !== stepId)
            : [...prev.completedSteps, stepId];
          const doneSet = new Set(completedSteps);
          const next: CourseProgress = {
            completedSteps,
            completed: allStepIds.length > 0 && allStepIds.every((id) => doneSet.has(id)),
            updatedAt: Date.now(),
          };
          const today = todayStr();
          return {
            courseProgress: { ...s.courseProgress, [courseId]: next },
            // 学习行为也算打卡
            activeDates: s.activeDates.includes(today)
              ? s.activeDates
              : [...s.activeDates, today].slice(-400),
          };
        }),

      addPractice: (type, durationSec) =>
        set((s) => {
          const today = todayStr();
          const record: PracticeRecord = {
            id: generateId(),
            type,
            durationSec,
            completedAt: Date.now(),
          };
          return {
            practices: [record, ...s.practices].slice(0, 100),
            totalPracticeSeconds: s.totalPracticeSeconds + durationSec,
            totalPracticeCount: s.totalPracticeCount + 1,
            activeDates: s.activeDates.includes(today)
              ? s.activeDates
              : [...s.activeDates, today].slice(-400),
          };
        }),

      markActive: () =>
        set((s) => {
          const today = todayStr();
          if (s.activeDates.includes(today)) return s;
          return { activeDates: [...s.activeDates, today].slice(-400) };
        }),
    }),
    { name: 'drawmate:progress' },
  ),
);

/** 读取某课程的进度统计（无记录时返回零值） */
export function getCourseStats(
  courseProgress: Record<string, CourseProgress>,
  courseId: string,
  totalSteps: number,
): { done: number; total: number; completed: boolean } {
  const p = courseProgress[courseId];
  return {
    done: p?.completedSteps.length ?? 0,
    total: totalSteps,
    completed: p?.completed ?? false,
  };
}
