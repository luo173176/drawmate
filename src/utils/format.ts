/** 展示格式化工具 */

/** 秒数转人类可读时长，如 “2 小时 15 分钟” */
export function formatSeconds(sec: number): string {
  if (sec < 60) return `${sec} 秒`;
  if (sec < 3600) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m} 分钟 ${s} 秒` : `${m} 分钟`;
  }
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return m > 0 ? `${h} 小时 ${m} 分钟` : `${h} 小时`;
}

/** 时间戳转 YYYY-MM-DD HH:mm */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 时间戳转 MM-DD HH:mm（用于自动命名作品） */
export function formatDateTimeShort(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
