/** 全局类型定义 */

/** 课程难度 */
export type Difficulty = '入门' | '初级' | '中级';

/** 参考图条目（内置 SVG 线稿或上传图片的元信息） */
export interface ReferenceItem {
  id: string;
  title: string;
  /** 内联 SVG 字符串，viewBox 统一为 0 0 400 300 */
  svg: string;
}

/** 课程的单个学习步骤 */
export interface Step {
  id: string;
  title: string;
  description: string;
  tips: string[];
}

/** 一门完整课程 */
export interface Course {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  description: string;
  /** 学习目标列表 */
  goals: string[];
  /** 讲解正文（若干段落） */
  explanation: string[];
  steps: Step[];
  /** 课后练习任务 */
  exercises: string[];
  reference: ReferenceItem;
}

/** 画廊作品（仅存缩略图 dataURL，不存原图，控制 localStorage 体积） */
export interface Artwork {
  id: string;
  title: string;
  dataUrl: string;
  width: number;
  height: number;
  createdAt: number;
  source: 'studio' | 'practice' | 'course';
  /** 来源说明，如练习模式名 */
  sourceLabel?: string;
}

/** 练习模式类型 */
export type PracticeType = 'gesture' | 'blind' | 'oneline' | 'timed';

/** 一次练习记录 */
export interface PracticeRecord {
  id: string;
  type: PracticeType;
  /** 实际用时（秒） */
  durationSec: number;
  completedAt: number;
}

/** 单门课程的学习进度 */
export interface CourseProgress {
  /** 已掌握的步骤 id */
  completedSteps: string[];
  completed: boolean;
  updatedAt: number;
}

/** 参考图网格模式 */
export type GridMode = 'none' | 'grid' | 'thirds';

/** 主题设置 */
export type Theme = 'light' | 'dark' | 'system';

/** 画布历史状态（用于启用/禁用撤销重做按钮） */
export interface CanvasHistoryState {
  canUndo: boolean;
  canRedo: boolean;
  dirty: boolean;
}
