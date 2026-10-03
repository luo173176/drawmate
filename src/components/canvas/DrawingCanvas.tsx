import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useBrushStore } from '@/stores/brushStore';
import type { CanvasHistoryState, GridMode } from '@/types';

/** 画布逻辑分辨率固定为 4:3，通过 CSS 缩放适配屏幕，保证导出尺寸一致 */
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 960;
/** 撤销栈上限（dataURL 快照，防止内存膨胀） */
const MAX_HISTORY = 30;

export interface DrawingCanvasHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  /** 导出白底全尺寸 PNG dataURL */
  exportPNG: () => string;
  /** 导出缩略图 dataURL（默认最长边 480px，用于画廊存储） */
  exportThumbnail: (maxSize?: number) => string;
  /** 一笔画模式：解除落笔锁定 */
  unlockStroke: () => void;
  isEmpty: () => boolean;
}

export interface DrawingCanvasProps {
  /** 参考图 dataURL（内置 SVG 或用户上传），为空则不显示 */
  referenceUrl?: string | null;
  referenceOpacity?: number;
  referenceGrid?: GridMode;
  /** 仅镜像参考图层 */
  referenceMirror?: boolean;
  /** 盲画模式：落笔时隐藏自己的笔迹 */
  hideWhileDrawing?: boolean;
  /** 一笔画模式：抬笔后锁定画布 */
  singleStroke?: boolean;
  disabled?: boolean;
  onStrokeEnd?: () => void;
  onHistoryChange?: (state: CanvasHistoryState) => void;
}

/** 压感缩放：手写笔（pointerType === 'pen'）按实际压力调整线宽，鼠标/触控恒为 1 */
function pressureScale(e: ReactPointerEvent<HTMLCanvasElement>, enabled: boolean): number {
  if (enabled && e.pointerType === 'pen') {
    return Math.max(0.15, e.pressure > 0 ? e.pressure : 0.5);
  }
  return 1;
}

/** 网格/九宫格覆盖层样式 */
function gridStyle(grid: GridMode): CSSProperties {
  const line = 'rgba(59,130,246,0.35)';
  return {
    backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: grid === 'grid' ? '12.5% 12.5%' : '33.333% 33.333%',
  };
}

/**
 * 绘画画布核心组件。
 * 双层画布结构：笔迹先以全不透明画在预览层，抬笔后按笔刷透明度合成到主层，
 * 避免“一笔之内透明度叠加”的问题；橡皮用 destination-out 实现。
 */
const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(function DrawingCanvas(
  {
    referenceUrl = null,
    referenceOpacity = 0.5,
    referenceGrid = 'none',
    referenceMirror = false,
    hideWhileDrawing = false,
    singleStroke = false,
    disabled = false,
    onStrokeEnd,
    onHistoryChange,
  },
  ref,
) {
  const { tool, color, size, opacity, pressureEnabled } = useBrushStore();

  const mainRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const drawingRef = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const strokeLockedRef = useRef(false);
  const dirtyRef = useRef(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const notify = () => {
    onHistoryChange?.({
      canUndo: undoStack.current.length > 0,
      canRedo: redoStack.current.length > 0,
      dirty: dirtyRef.current,
    });
  };

  const getPos = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height),
    };
  };

  const pushUndo = () => {
    const canvas = mainRef.current;
    if (!canvas) return;
    undoStack.current.push(canvas.toDataURL());
    if (undoStack.current.length > MAX_HISTORY) undoStack.current.shift();
    redoStack.current = [];
  };

  const restoreFrom = (dataUrl: string) => {
    const canvas = mainRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  };

  /** 把预览层的当前笔画按笔刷透明度合成到主层 */
  const compositeStroke = () => {
    const main = mainRef.current;
    const preview = previewRef.current;
    if (!main || !preview) return;
    const mctx = main.getContext('2d');
    if (!mctx) return;
    mctx.save();
    mctx.globalAlpha = opacity;
    mctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    mctx.drawImage(preview, 0, 0);
    mctx.restore();
    preview.getContext('2d')?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    if (singleStroke && strokeLockedRef.current) return;
    // 捕获指针以保证移出画布也能持续收到 move 事件；无效指针（合成事件等）会抛错，忽略即可
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    pushUndo();
    drawingRef.current = true;
    const pos = getPos(e);
    lastPoint.current = pos;
    setIsDrawing(true);

    const pctx = previewRef.current?.getContext('2d');
    if (!pctx) return;
    pctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    pctx.lineCap = 'round';
    pctx.lineJoin = 'round';
    const strokeColor = tool === 'eraser' ? '#ffffff' : color;
    pctx.strokeStyle = strokeColor;
    pctx.fillStyle = strokeColor;
    pctx.lineWidth = Math.max(1, size * pressureScale(e, pressureEnabled));
    // 画一个初始圆点，保证单击也能留下笔迹
    pctx.beginPath();
    pctx.arc(pos.x, pos.y, pctx.lineWidth / 2, 0, Math.PI * 2);
    pctx.fill();
    notify();
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const last = lastPoint.current;
    const pctx = previewRef.current?.getContext('2d');
    if (!last || !pctx) return;
    const pos = getPos(e);
    pctx.lineWidth = Math.max(1, size * pressureScale(e, pressureEnabled));
    pctx.beginPath();
    pctx.moveTo(last.x, last.y);
    pctx.lineTo(pos.x, pos.y);
    pctx.stroke();
    lastPoint.current = pos;
  };

  const finishStroke = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    compositeStroke();
    dirtyRef.current = true;
    if (singleStroke) strokeLockedRef.current = true;
    setIsDrawing(false);
    notify();
    onStrokeEnd?.();
  };

  useImperativeHandle(ref, () => ({
    undo: () => {
      const canvas = mainRef.current;
      if (!canvas || undoStack.current.length === 0) return;
      redoStack.current.push(canvas.toDataURL());
      const prev = undoStack.current.pop();
      if (prev) restoreFrom(prev);
      notify();
    },
    redo: () => {
      const canvas = mainRef.current;
      if (!canvas || redoStack.current.length === 0) return;
      undoStack.current.push(canvas.toDataURL());
      const next = redoStack.current.pop();
      if (next) restoreFrom(next);
      notify();
    },
    clear: () => {
      const canvas = mainRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      pushUndo();
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      dirtyRef.current = true;
      strokeLockedRef.current = false;
      notify();
    },
    exportPNG: () => {
      const out = document.createElement('canvas');
      out.width = CANVAS_WIDTH;
      out.height = CANVAS_HEIGHT;
      const octx = out.getContext('2d');
      if (octx && mainRef.current) {
        octx.fillStyle = '#ffffff';
        octx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        octx.drawImage(mainRef.current, 0, 0);
      }
      return out.toDataURL('image/png');
    },
    exportThumbnail: (maxSize = 480) => {
      const scale = Math.min(1, maxSize / Math.max(CANVAS_WIDTH, CANVAS_HEIGHT));
      const w = Math.round(CANVAS_WIDTH * scale);
      const h = Math.round(CANVAS_HEIGHT * scale);
      const out = document.createElement('canvas');
      out.width = w;
      out.height = h;
      const octx = out.getContext('2d');
      if (octx && mainRef.current) {
        octx.fillStyle = '#ffffff';
        octx.fillRect(0, 0, w, h);
        octx.drawImage(mainRef.current, 0, 0, w, h);
      }
      return out.toDataURL('image/png');
    },
    unlockStroke: () => {
      strokeLockedRef.current = false;
    },
    isEmpty: () => !dirtyRef.current,
  }));

  return (
    <div
      className="relative mx-auto"
      style={{ width: 'min(100%, calc(70vh * 4 / 3))', aspectRatio: '4 / 3' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-white shadow-paper ring-1 ring-zinc-200 dark:ring-zinc-700">
        {/* 绘制层：盲画模式下落笔时整体隐藏 */}
        <div
          className={`absolute inset-0 transition-opacity duration-150 ${
            hideWhileDrawing && isDrawing ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <canvas
            ref={mainRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            role="img"
            aria-label="绘画区域，支持鼠标、触控与手写笔"
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          />
          <canvas
            ref={previewRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        </div>

        {/* 参考图层：描摹用，置于笔迹之上，透明度可调 */}
        {referenceUrl && (
          <img
            src={referenceUrl}
            alt="参考图"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: referenceOpacity,
              transform: referenceMirror ? 'scaleX(-1)' : undefined,
            }}
          />
        )}

        {/* 网格 / 九宫格覆盖层 */}
        {referenceGrid !== 'none' && (
          <div
            className="pointer-events-none absolute inset-0"
            style={gridStyle(referenceGrid)}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
});

export default DrawingCanvas;
