/** 日期与时长格式化工具 */

/** 将日期格式化为本地 YYYY-MM-DD 字符串 */
export function dateToStr(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 今天的日期字符串（用于连续打卡统计） */
export function todayStr(): string {
  return dateToStr(new Date());
}

/** 计算连续打卡天数：今天没打卡则从昨天开始回溯 */
export function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  const dayMs = 86_400_000;
  let cursor = new Date();
  if (!set.has(dateToStr(cursor))) {
    cursor = new Date(cursor.getTime() - dayMs);
  }
  let streak = 0;
  while (set.has(dateToStr(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - dayMs);
  }
  return streak;
}
