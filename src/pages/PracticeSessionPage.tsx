import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff, Play, RefreshCw, Unlock } from 'lucide-react';
import DrawingCanvas from '@/components/canvas/DrawingCanvas';
import type { DrawingCanvasHandle } from '@/components/canvas/DrawingCanvas';
import ReferencePanel from '@/components/canvas/ReferencePanel';
import { useReferenceState } from '@/components/canvas/useReferenceState';
import { getPracticeMode } from '@/constants/practice';
import { allReferences } from '@/data/references';
import { useProgressStore } from '@/stores/progressStore';
import { useGalleryStore, MAX_ARTWORKS } from '@/stores/galleryStore';
import { toast } from '@/stores/toastStore';
import { downloadDataUrl, svgToDataUrl } from '@/utils/image';
import { formatSeconds } from '@/utils/format';
import type { ReferenceItem } from '@/types';

/** 随机挑一张参考图（避开刚用过的那张） */
function pickRandomRef(excludeId?: string): ReferenceItem {
  const pool = allReferences.filter((r) => r.id !== excludeId);
  return pool[Math.floor(Math.random() * pool.length)];
}

type Phase = 'setup' | 'running' | 'done';

export default function PracticeSessionPage() {
  const { type } = useParams<{ type: string }>();
  const mode = type ? getPracticeMode(type) : undefined;
  const navigate = useNavigate();
  const addPractice = useProgressStore((s) => s.addPractice);
  const addArtwork = useGalleryStore((s) => s.addArtwork);

  const [phase, setPhase] = useState<Phase>('setup');
  const [duration, setDuration] = useState(mode?.defaultDuration ?? 0);
  const [refItem, setRefItem] = useState<ReferenceItem>(() => pickRandomRef());
  const [elapsed, setElapsed] = useState(0);
  /** 盲画模式：临时显示自己的笔迹 */
  const [reveal, setReveal] = useState(false);
  /** 重新开始时递增，强制重建画布（清空笔迹与锁定状态） */
  const [attempt, setAttempt] = useState(0);
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const refState = useReferenceState(true);

  const countDown = mode?.countDown ?? true;
  const actualSeconds = countDown ? Math.min(elapsed, duration || elapsed) : elapsed;

  // 计时器：running 阶段每秒 +1
  useEffect(() => {
    if (phase !== 'running') return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  const finish = useCallback(() => setPhase('done'), []);

  // 倒计时归零自动结束
  useEffect(() => {
    if (phase === 'running' && countDown && elapsed >= duration) finish();
  }, [phase, countDown, elapsed, duration, finish]);

  if (!mode) return <Navigate to="/practice" replace />;

  const start = () => {
    setElapsed(0);
    setReveal(false);
    setAttempt((a) => a + 1);
    refState.setCurrent({
      title: refItem.title,
      url: svgToDataUrl(refItem.svg),
      sourceId: refItem.id,
    });
    setPhase('running');
  };

  const selectRef = (item: ReferenceItem) => {
    setRefItem(item);
    refState.setCurrent({
      title: item.title,
      url: svgToDataUrl(item.svg),
      sourceId: item.id,
    });
  };

  const handleSave = () => {
    addPractice(mode.type, actualSeconds);
    const handle = canvasRef.current;
    if (handle && !handle.isEmpty()) {
      const artwork = addArtwork({
        title: `${mode.name}作品`,
        dataUrl: handle.exportThumbnail(),
        width: 480,
        height: 360,
        source: 'practice',
        sourceLabel: mode.name,
      });
      if (artwork) {
        toast('作品已保存到画廊', 'success');
        navigate('/gallery');
      } else {
        toast(`画廊已满（上限 ${MAX_ARTWORKS} 件），练习已记录`, 'error');
        navigate('/progress');
      }
      return;
    }
    toast('练习已记录，继续加油！', 'success');
    navigate('/progress');
  };

  const handleSkip = () => {
    addPractice(mode.type, actualSeconds);
    toast('练习已记录，继续加油！', 'success');
    navigate('/progress');
  };

  const handleDownload = () => {
    const handle = canvasRef.current;
    if (!handle || handle.isEmpty()) {
      toast('还没有可以下载的作品', 'error');
      return;
    }
    downloadDataUrl(handle.exportPNG(), `drawmate-practice-${Date.now()}.png`);
    toast('已下载全尺寸 PNG', 'success');
  };

  /* ---------------- 设置阶段 ---------------- */
  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          to="/practice"
          className="text-sm text-zinc-400 transition-colors hover:text-primary-500"
        >
          ← 返回练习中心
        </Link>

        <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start gap-4">
            <span className="text-4xl" aria-hidden="true">
              {mode.emoji}
            </span>
            <div>
              <h1 className="text-xl font-black">{mode.name}</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{mode.description}</p>
            </div>
          </div>

          <ol className="mt-4 space-y-1.5">
            {mode.howTo.map((tip, i) => (
              <li key={tip} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded bg-primary-100 text-[11px] font-bold text-primary-600 dark:bg-primary-500/15 dark:text-primary-400"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>

          {mode.durations.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-bold">练习时长</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {mode.durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    aria-pressed={duration === d}
                    className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                      duration === d
                        ? 'border-primary-400 bg-primary-50 text-primary-600 dark:border-primary-500/50 dark:bg-primary-500/15 dark:text-primary-400'
                        : 'border-zinc-200 text-zinc-600 hover:border-primary-300 dark:border-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {d >= 60 ? `${d / 60} 分钟` : `${d} 秒`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">参考图</p>
              <button
                onClick={() => setRefItem((r) => pickRandomRef(r.id))}
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
                aria-label="换一张参考图"
              >
                <RefreshCw size={13} aria-hidden="true" />
                换一张
              </button>
            </div>
            <div className="mt-2 rounded-xl bg-white p-2 ring-1 ring-zinc-200 dark:ring-zinc-700">
              <img
                src={svgToDataUrl(refItem.svg)}
                alt={`参考图：${refItem.title}`}
                className="mx-auto max-h-44 rounded"
              />
              <p className="pb-1 pt-1 text-center text-xs text-zinc-400">{refItem.title}</p>
            </div>
          </div>

          <button
            onClick={start}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 font-bold text-white transition-colors hover:bg-primary-600"
          >
            <Play size={18} aria-hidden="true" />
            开始练习
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- 进行中 / 完成阶段 ---------------- */
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2" aria-live="off">
          <span className="text-3xl font-black tabular-nums text-primary-600 dark:text-primary-400">
            {countDown ? Math.max(0, duration - elapsed) : elapsed}
          </span>
          <span className="text-sm text-zinc-400">秒{countDown ? '' : ' · 正计时'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode.type === 'blind' && (
            <button
              onClick={() => setReveal((v) => !v)}
              aria-pressed={reveal}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-zinc-700 dark:text-zinc-300"
            >
              {reveal ? (
                <EyeOff size={15} aria-hidden="true" />
              ) : (
                <Eye size={15} aria-hidden="true" />
              )}
              {reveal ? '隐藏笔迹' : '偷看一眼'}
            </button>
          )}
          {mode.type === 'oneline' && (
            <button
              onClick={() => canvasRef.current?.unlockStroke()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-zinc-700 dark:text-zinc-300"
              aria-label="解锁画布重新下笔"
            >
              <Unlock size={15} aria-hidden="true" />
              解锁重画
            </button>
          )}
          <button
            onClick={finish}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            结束练习
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="min-w-0 flex-1">
          <DrawingCanvas
            key={attempt}
            ref={canvasRef}
            hideWhileDrawing={mode.type === 'blind' && !reveal}
            singleStroke={mode.type === 'oneline'}
          />
          {mode.type === 'oneline' && (
            <p className="mt-2 text-center text-xs text-zinc-400">
              抬笔即锁定，点“解锁重画”可以重新下笔
            </p>
          )}
          {mode.type === 'blind' && (
            <p className="mt-2 text-center text-xs text-zinc-400">
              落笔时笔迹自动隐藏，眼睛请留在参考图上
            </p>
          )}
        </section>

        <aside className="w-full shrink-0 lg:w-80">
          <ReferencePanel
            current={refState.current}
            onSelect={selectRef}
            onUpload={(title, url) => {
              refState.setCurrent({ title, url });
              toast('参考图已就绪', 'success');
            }}
            opacity={refState.opacity}
            onOpacityChange={refState.setOpacity}
            grid={refState.grid}
            onGridChange={refState.setGrid}
            mirror={refState.mirror}
            onMirrorChange={refState.setMirror}
            onClear={() => refState.setCurrent(null)}
          />
        </aside>
      </div>

      {phase === 'done' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="练习完成"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-zinc-800">
            <span className="text-5xl" aria-hidden="true">
              🎉
            </span>
            <h2 className="mt-3 text-lg font-bold">练习完成！</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {mode.name} · 用时 {formatSeconds(actualSeconds)}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={handleSave}
                className="rounded-xl bg-primary-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
              >
                保存作品并记录
              </button>
              <button
                onClick={handleDownload}
                className="rounded-xl border border-zinc-200 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
              >
                只下载 PNG，不进画廊
              </button>
              <button
                onClick={handleSkip}
                className="rounded-xl border border-zinc-200 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700"
              >
                仅记录练习，不保存作品
              </button>
              <button
                onClick={() => {
                  setElapsed(0);
                  setPhase('setup');
                }}
                className="text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                返回设置页重新调整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
