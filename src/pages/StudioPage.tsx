import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DrawingCanvas from '@/components/canvas/DrawingCanvas';
import type { DrawingCanvasHandle } from '@/components/canvas/DrawingCanvas';
import Toolbar from '@/components/canvas/Toolbar';
import ReferencePanel from '@/components/canvas/ReferencePanel';
import { useReferenceState } from '@/components/canvas/useReferenceState';
import { useBrushStore } from '@/stores/brushStore';
import { useGalleryStore, MAX_ARTWORKS } from '@/stores/galleryStore';
import { useProgressStore } from '@/stores/progressStore';
import { toast } from '@/stores/toastStore';
import { getReference } from '@/data/references';
import { downloadDataUrl, svgToDataUrl } from '@/utils/image';
import { formatDateTimeShort } from '@/utils/format';
import type { CanvasHistoryState, ReferenceItem } from '@/types';

export default function StudioPage() {
  const brush = useBrushStore();
  const addArtwork = useGalleryStore((s) => s.addArtwork);
  const markActive = useProgressStore((s) => s.markActive);

  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [history, setHistory] = useState<CanvasHistoryState>({
    canUndo: false,
    canRedo: false,
    dirty: false,
  });
  const refState = useReferenceState(false);
  const [searchParams] = useSearchParams();
  const initialRefApplied = useRef(false);

  // 支持 /studio?ref=课程id 深链接：打开对应课程的参考图
  useEffect(() => {
    if (initialRefApplied.current) return;
    initialRefApplied.current = true;
    const refId = searchParams.get('ref');
    if (!refId) return;
    const item = getReference(refId);
    if (item) {
      refState.setCurrent({
        title: item.title,
        url: svgToDataUrl(item.svg),
        sourceId: item.id,
      });
      refState.setActive(true);
    }
    // 仅在首次进入时应用一次深链接参数
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHistoryChange = useCallback((s: CanvasHistoryState) => setHistory(s), []);

  const handleSelectRef = useCallback((item: ReferenceItem) => {
    refState.setCurrent({
      title: item.title,
      url: svgToDataUrl(item.svg),
      sourceId: item.id,
    });
    refState.setActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadRef = useCallback((title: string, url: string) => {
    refState.setCurrent({ title, url });
    refState.setActive(true);
    toast('参考图已就绪，可调节透明度进行描摹', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearRef = useCallback(() => {
    refState.setCurrent(null);
    refState.setActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = useCallback(() => {
    const handle = canvasRef.current;
    if (!handle) return;
    if (handle.isEmpty()) {
      toast('画布还是空的，先画点什么吧', 'error');
      return;
    }
    const artwork = addArtwork({
      title: `画作 ${formatDateTimeShort(Date.now())}`,
      dataUrl: handle.exportThumbnail(),
      width: 480,
      height: 360,
      source: 'studio',
    });
    if (!artwork) {
      toast(`画廊已满（上限 ${MAX_ARTWORKS} 件），请先删除部分作品`, 'error');
      return;
    }
    markActive();
    toast('已保存到画廊', 'success');
  }, [addArtwork, markActive]);

  const handleDownload = useCallback(() => {
    const handle = canvasRef.current;
    if (!handle) return;
    if (handle.isEmpty()) {
      toast('画布还是空的，先画点什么吧', 'error');
      return;
    }
    downloadDataUrl(handle.exportPNG(), `drawmate-${Date.now()}.png`);
    toast('已下载全尺寸 PNG', 'success');
  }, []);

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
    toast('画布已清空（可撤销）', 'info');
  }, []);

  // 键盘快捷键（不依赖依赖数组，保证每次渲染捕获最新状态）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
      ) {
        return;
      }
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) canvasRef.current?.redo();
        else canvasRef.current?.undo();
        return;
      }
      if (mod && key === 'y') {
        e.preventDefault();
        canvasRef.current?.redo();
        return;
      }
      if (mod && key === 's') {
        e.preventDefault();
        handleSave();
        return;
      }
      if (mod) return;

      if (key === 'b') brush.setTool('brush');
      else if (key === 'e') brush.setTool('eraser');
      else if (key === '[') brush.setSize(Math.max(2, brush.size - 2));
      else if (key === ']') brush.setSize(Math.min(60, brush.size + 2));
      else if (key === 'g')
        refState.setGrid((g) => (g === 'none' ? 'grid' : g === 'grid' ? 'thirds' : 'none'));
      else if (key === 'r') refState.setActive((v) => !v);
      else if (key === 'm') refState.setMirror((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold">画室</h1>
        <p className="hidden text-xs text-zinc-400 sm:block">
          支持鼠标 / 触控 / 手写笔 · B 画笔 · E 橡皮 · [ ] 调整笔刷 · Ctrl+Z 撤销
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <section className="min-w-0 flex-1">
          <Toolbar
            tool={brush.tool}
            onToolChange={brush.setTool}
            color={brush.color}
            onColorChange={brush.setColor}
            size={brush.size}
            onSizeChange={brush.setSize}
            opacity={brush.opacity}
            onOpacityChange={brush.setOpacity}
            pressureEnabled={brush.pressureEnabled}
            onPressureChange={brush.setPressureEnabled}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
            onUndo={() => canvasRef.current?.undo()}
            onRedo={() => canvasRef.current?.redo()}
            onClear={handleClear}
            onSave={handleSave}
            onDownload={handleDownload}
            refActive={refState.active}
            onToggleRef={() => refState.setActive((v) => !v)}
          />

          <div className="mt-4">
            <DrawingCanvas
              ref={canvasRef}
              referenceUrl={refState.active ? refState.current?.url ?? null : null}
              referenceOpacity={refState.opacity}
              referenceGrid={refState.grid}
              referenceMirror={refState.mirror}
              onHistoryChange={handleHistoryChange}
            />
          </div>

          <p className="mt-3 text-center text-xs text-zinc-400">
            参考图会垫在笔迹上方，调节透明度即可描摹；保存到画廊的是缩略图，“下载”可获得全尺寸
            PNG。
          </p>
        </section>

        {refState.active && (
          <aside className="w-full shrink-0 lg:w-80">
            <ReferencePanel
              current={refState.current}
              onSelect={handleSelectRef}
              onUpload={handleUploadRef}
              opacity={refState.opacity}
              onOpacityChange={refState.setOpacity}
              grid={refState.grid}
              onGridChange={refState.setGrid}
              mirror={refState.mirror}
              onMirrorChange={refState.setMirror}
              onClear={handleClearRef}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
