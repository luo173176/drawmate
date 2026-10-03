import {
  Brush,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Save,
  Download,
  Image as ImageIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Tool } from '@/stores/brushStore';
import { BRUSH_COLORS } from '@/constants/colors';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

function IconButton({ icon: Icon, label, onClick, disabled = false, active = false }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? 'border-primary-400 bg-primary-50 text-primary-600 dark:border-primary-500/50 dark:bg-primary-500/15 dark:text-primary-400'
          : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}

interface ToolbarProps {
  tool: Tool;
  onToolChange: (t: Tool) => void;
  color: string;
  onColorChange: (c: string) => void;
  size: number;
  onSizeChange: (n: number) => void;
  opacity: number;
  onOpacityChange: (n: number) => void;
  pressureEnabled: boolean;
  onPressureChange: (b: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onDownload: () => void;
  refActive: boolean;
  onToggleRef: () => void;
}

/** 画室工具栏：工具、颜色、大小、透明度与历史操作 */
export default function Toolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  size,
  onSizeChange,
  opacity,
  onOpacityChange,
  pressureEnabled,
  onPressureChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onDownload,
  refActive,
  onToggleRef,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      {/* 工具组 */}
      <div className="flex items-center gap-1.5">
        <IconButton
          icon={Brush}
          label="画笔（B）"
          onClick={() => onToolChange('brush')}
          active={tool === 'brush'}
        />
        <IconButton
          icon={Eraser}
          label="橡皮（E）"
          onClick={() => onToolChange('eraser')}
          active={tool === 'eraser'}
        />
        <IconButton
          icon={ImageIcon}
          label={refActive ? '隐藏参考图（R）' : '显示参考图（R）'}
          onClick={onToggleRef}
          active={refActive}
        />
      </div>

      <span className="hidden h-6 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" aria-hidden="true" />

      {/* 颜色组 */}
      <div className="flex items-center gap-1.5">
        {BRUSH_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            aria-label={`选择颜色 ${c}`}
            aria-pressed={color === c}
            className={`h-6 w-6 rounded-full border transition-transform ${
              color === c
                ? 'scale-110 border-zinc-900 ring-2 ring-primary-400 dark:border-white'
                : 'border-zinc-300 hover:scale-105 dark:border-zinc-600'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          aria-label="自定义颜色"
          title="自定义颜色"
          className="h-7 w-7 cursor-pointer rounded-md border border-zinc-200 bg-transparent p-0 dark:border-zinc-700"
        />
      </div>

      <span className="hidden h-6 w-px bg-zinc-200 dark:bg-zinc-700 sm:block" aria-hidden="true" />

      {/* 大小 / 透明度 */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="whitespace-nowrap">大小 {size}px</span>
          <input
            type="range"
            min={2}
            max={60}
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="w-24"
            aria-label="笔刷大小"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="whitespace-nowrap">不透明度 {Math.round(opacity * 100)}%</span>
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            className="w-24"
            aria-label="笔刷不透明度"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={pressureEnabled}
            onChange={(e) => onPressureChange(e.target.checked)}
            className="h-3.5 w-3.5 accent-orange-500"
            aria-label="使用手写笔压感"
          />
          压感
        </label>
      </div>

      {/* 历史与保存 */}
      <div className="ml-auto flex items-center gap-1.5">
        <IconButton icon={Undo2} label="撤销（Ctrl+Z）" onClick={onUndo} disabled={!canUndo} />
        <IconButton icon={Redo2} label="重做（Ctrl+Shift+Z）" onClick={onRedo} disabled={!canRedo} />
        <IconButton icon={Trash2} label="清空画布" onClick={onClear} />
        <IconButton icon={Save} label="保存到画廊（Ctrl+S）" onClick={onSave} />
        <IconButton icon={Download} label="下载 PNG" onClick={onDownload} />
      </div>
    </div>
  );
}
