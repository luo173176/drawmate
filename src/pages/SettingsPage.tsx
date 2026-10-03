import { useState } from 'react';
import { AlertTriangle, Keyboard, Monitor, Moon, Sun, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Theme } from '@/types';
import { STUDIO_SHORTCUTS } from '@/constants/shortcuts';
import ConfirmDialog from '@/components/ConfirmDialog';

const THEME_OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: '亮色', icon: Sun },
  { value: 'dark', label: '暗色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
];

export default function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const [resetOpen, setResetOpen] = useState(false);

  const handleReset = () => {
    // 清除本应用写入 localStorage 的所有键，然后刷新页面
    Object.keys(localStorage)
      .filter((k) => k.startsWith('drawmate:'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold">设置</h1>

      {/* 外观 */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-bold">外观</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">选择亮色、暗色或跟随系统。</p>
        <div
          className="mt-4 grid grid-cols-3 gap-3"
          role="radiogroup"
          aria-label="主题模式"
        >
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              role="radio"
              aria-checked={theme === opt.value}
              className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm font-bold transition-colors ${
                theme === opt.value
                  ? 'border-primary-400 bg-primary-50 text-primary-600 dark:border-primary-500/50 dark:bg-primary-500/10 dark:text-primary-400'
                  : 'border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400'
              }`}
            >
              <opt.icon size={20} aria-hidden="true" />
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* 快捷键 */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Keyboard size={17} className="text-primary-500" aria-hidden="true" />
          画室快捷键
        </h2>
        <dl className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
          {STUDIO_SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between gap-4 py-2.5">
              <dt>
                <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs dark:border-zinc-600 dark:bg-zinc-800">
                  {s.keys}
                </kbd>
              </dt>
              <dd className="text-sm text-zinc-500 dark:text-zinc-400">{s.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 数据管理 */}
      <section className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-500/30 dark:bg-red-500/5">
        <h2 className="flex items-center gap-2 text-base font-bold text-red-600 dark:text-red-400">
          <AlertTriangle size={17} aria-hidden="true" />
          危险区
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          你的所有数据（课程进度、练习记录、画廊作品、设置）都只保存在当前浏览器的
          localStorage 中，清除浏览器数据或换设备不会同步。重置将删除全部数据且无法恢复。
        </p>
        <button
          onClick={() => setResetOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
        >
          <Trash2 size={15} aria-hidden="true" />
          重置所有数据
        </button>
      </section>

      {/* 关于 */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-bold">关于画伴</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          画伴 DrawMate v0.1.0 —— 一个纯前端的绘画学习应用，基于 React + TypeScript +
          Canvas 构建，采用 MIT 协议开源。
        </p>
        <a
          href="https://github.com/luo173176/drawmate"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          GitHub 项目主页 ↗
        </a>
      </section>

      <ConfirmDialog
        open={resetOpen}
        title="重置所有数据？"
        description="课程进度、练习记录、画廊作品与设置将被全部删除，此操作无法恢复。"
        confirmText="确认重置"
        danger
        onConfirm={handleReset}
        onClose={() => setResetOpen(false)}
      />
    </div>
  );
}
