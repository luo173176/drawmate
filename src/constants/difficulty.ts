import type { Difficulty } from '@/types';

/** 难度徽章样式（课程卡片与课程详情页共用） */
export const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  入门: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  初级: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  中级: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
};
