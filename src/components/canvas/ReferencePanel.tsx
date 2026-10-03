import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Upload, FlipHorizontal } from 'lucide-react';
import type { GridMode, ReferenceItem } from '@/types';
import { allReferences } from '@/data/references';
import { svgToDataUrl } from '@/utils/image';
import type { ActiveReference } from './useReferenceState';

interface ReferencePanelProps {
  current: ActiveReference | null;
  onSelect: (item: ReferenceItem) => void;
  onUpload: (title: string, url: string) => void;
  opacity: number;
  onOpacityChange: (v: number) => void;
  grid: GridMode;
  onGridChange: (g: GridMode) => void;
  mirror: boolean;
  onMirrorChange: (v: boolean) => void;
  onClear: () => void;
}

/** 参考图面板：内置图库 / 上传图片 + 透明度、网格、镜像控制 */
export default function ReferencePanel({
  current,
  onSelect,
  onUpload,
  opacity,
  onOpacityChange,
  grid,
  onGridChange,
  mirror,
  onMirrorChange,
  onClear,
}: ReferencePanelProps) {
  const [tab, setTab] = useState<'builtin' | 'upload'>('builtin');

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(file.name.replace(/\.[^.]+$/, ''), reader.result);
      }
    };
    reader.readAsDataURL(file);
    // 清空 value，允许重复选择同一文件
    e.target.value = '';
  };

  const tabClass = (isActive: boolean) =>
    `flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-500 text-white shadow-sm'
        : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
    }`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-200">参考图模式</h2>

      <div className="mt-3 flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <button className={tabClass(tab === 'builtin')} onClick={() => setTab('builtin')}>
          内置图库
        </button>
        <button className={tabClass(tab === 'upload')} onClick={() => setTab('upload')}>
          上传图片
        </button>
      </div>

      <div className="mt-3">
        {tab === 'builtin' ? (
          <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
            {allReferences.map((item) => {
              const selected = current?.sourceId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  aria-pressed={selected}
                  aria-label={`选择参考图：${item.title}`}
                  className={`rounded-lg border p-1 text-center transition-colors ${
                    selected
                      ? 'border-primary-500 ring-2 ring-primary-200 dark:ring-primary-500/40'
                      : 'border-zinc-200 hover:border-primary-300 dark:border-zinc-700'
                  }`}
                >
                  <img
                    src={svgToDataUrl(item.svg)}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded bg-white object-contain"
                  />
                  <span className="mt-1 block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-8 text-sm text-zinc-500 transition-colors hover:border-primary-400 hover:text-primary-500 dark:border-zinc-600">
            <Upload size={20} aria-hidden="true" />
            点击上传图片作为参考
            <span className="text-xs text-zinc-400">支持 JPG / PNG / WebP，仅本地使用</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              aria-label="上传参考图片"
            />
          </label>
        )}
      </div>

      <div className="mt-4 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        {current && (
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            当前参考：<span className="font-medium">{current.title}</span>
          </p>
        )}

        <div>
          <label
            htmlFor="ref-opacity"
            className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400"
          >
            <span>参考图不透明度</span>
            <span>{Math.round(opacity * 100)}%</span>
          </label>
          <input
            id="ref-opacity"
            type="range"
            min={10}
            max={100}
            step={5}
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
            className="mt-1 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="参考图网格模式"
            value={grid}
            onChange={(e) => onGridChange(e.target.value as GridMode)}
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="none">无网格</option>
            <option value="grid">网格</option>
            <option value="thirds">九宫格</option>
          </select>

          <button
            onClick={() => onMirrorChange(!mirror)}
            aria-pressed={mirror}
            aria-label="参考图镜像翻转"
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
              mirror
                ? 'border-primary-400 bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            <FlipHorizontal size={13} aria-hidden="true" />
            镜像
          </button>

          <button
            onClick={onClear}
            aria-label="移除参考图"
            className="ml-auto rounded-lg px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:text-red-500"
          >
            移除参考
          </button>
        </div>
      </div>
    </div>
  );
}
