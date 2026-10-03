import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Trash2, X } from 'lucide-react';
import type { Artwork } from '@/types';
import { useGalleryStore } from '@/stores/galleryStore';
import { toast } from '@/stores/toastStore';
import { downloadDataUrl } from '@/utils/image';
import { formatDate } from '@/utils/format';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';

const SOURCE_NAMES: Record<Artwork['source'], string> = {
  studio: '画室',
  practice: '练习',
  course: '课程',
};

export default function GalleryPage() {
  const artworks = useGalleryStore((s) => s.artworks);
  const removeArtwork = useGalleryStore((s) => s.removeArtwork);
  const [viewing, setViewing] = useState<Artwork | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Artwork | null>(null);

  const download = (a: Artwork) => {
    downloadDataUrl(a.dataUrl, `${a.title}.png`);
    toast('已开始下载', 'success');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">作品画廊</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            共 {artworks.length} 件作品，缩略图保存在本地浏览器中。
          </p>
        </div>
        <Link
          to="/studio"
          className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
        >
          去画室创作
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            emoji="🎨"
            title="画廊还空着"
            description="去画室画第一幅作品，或在练习模式完成一次速写，作品就会出现在这里。"
            action={
              <Link
                to="/studio"
                className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
              >
                开始创作
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {artworks.map((a) => (
            <li
              key={a.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <img
                src={a.dataUrl}
                alt={`作品：${a.title}`}
                loading="lazy"
                className="aspect-[4/3] w-full bg-white object-contain"
              />
              <div className="p-3">
                <p className="truncate text-sm font-bold" title={a.title}>
                  {a.title}
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {formatDate(a.createdAt)}
                  {a.sourceLabel ? ` · ${a.sourceLabel}` : ` · ${SOURCE_NAMES[a.source]}`}
                </p>
                <div className="mt-2 flex gap-1.5">
                  <button
                    onClick={() => setViewing(a)}
                    aria-label={`查看作品 ${a.title}`}
                    title="查看大图"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-primary-300 hover:text-primary-500 dark:border-zinc-700"
                  >
                    <Eye size={14} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => download(a)}
                    aria-label={`下载作品 ${a.title}`}
                    title="下载 PNG"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-primary-300 hover:text-primary-500 dark:border-zinc-700"
                  >
                    <Download size={14} aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setPendingDelete(a)}
                    aria-label={`删除作品 ${a.title}`}
                    title="删除"
                    className="ml-auto grid h-8 w-8 place-items-center rounded-lg border border-zinc-200 text-zinc-400 transition-colors hover:border-red-300 hover:text-red-500 dark:border-zinc-700"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 查看大图 */}
      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`查看作品：${viewing.title}`}
          onClick={() => setViewing(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl dark:bg-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-bold">{viewing.title}</h3>
                <p className="text-xs text-zinc-400">
                  {formatDate(viewing.createdAt)}
                  {viewing.sourceLabel ? ` · ${viewing.sourceLabel}` : ''}
                </p>
              </div>
              <button
                onClick={() => setViewing(null)}
                aria-label="关闭查看"
                className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <img
              src={viewing.dataUrl}
              alt={`作品大图：${viewing.title}`}
              className="mt-3 w-full rounded-xl bg-white"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => download(viewing)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-600"
              >
                <Download size={14} aria-hidden="true" />
                下载 PNG
              </button>
              <button
                onClick={() => {
                  setPendingDelete(viewing);
                  setViewing(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:border-red-300 dark:border-zinc-600"
              >
                <Trash2 size={14} aria-hidden="true" />
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      <ConfirmDialog
        open={pendingDelete !== null}
        title="删除这幅作品？"
        description={`“${pendingDelete?.title ?? ''}”将从画廊中删除，此操作不可恢复。`}
        confirmText="删除"
        danger
        onConfirm={() => {
          if (pendingDelete) {
            removeArtwork(pendingDelete.id);
            toast('作品已删除', 'info');
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
