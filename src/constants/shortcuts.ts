/** 画室键盘快捷键说明（设置页与画室共用） */
export interface Shortcut {
  keys: string;
  description: string;
}

export const STUDIO_SHORTCUTS: Shortcut[] = [
  { keys: 'B', description: '切换为画笔' },
  { keys: 'E', description: '切换为橡皮' },
  { keys: '[ / ]', description: '减小 / 增大笔刷大小' },
  { keys: 'G', description: '循环切换参考图网格：无 → 网格 → 九宫格' },
  { keys: 'R', description: '显示 / 隐藏参考图' },
  { keys: 'M', description: '参考图镜像翻转' },
  { keys: 'Ctrl/⌘ + Z', description: '撤销' },
  { keys: 'Ctrl/⌘ + Shift + Z 或 Ctrl/⌘ + Y', description: '重做' },
  { keys: 'Ctrl/⌘ + S', description: '保存作品到画廊' },
];
