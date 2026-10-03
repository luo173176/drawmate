import type { ReferenceItem } from '@/types';
import { courses } from './courses';

/**
 * 静物参考图库：用于画室描摹与练习模式的内置线稿。
 * SVG 统一 viewBox="0 0 400 300"，线条用 currentColor（以图片渲染时为黑色）。
 */

const OBJECT_SVGS: ReferenceItem[] = [
  {
    id: 'obj-cup',
    title: '马克杯',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M135 110h120v90c0 12-10 22-22 22h-76c-12 0-22-10-22-22v-90"/>
  <ellipse cx="195" cy="110" rx="60" ry="15"/>
  <path d="M255 128C292 122 298 168 260 174"/>
  <path d="M170 88c6-8 6-16 0-24" stroke-width="2.5"/>
  <path d="M205 88c6-8 6-16 0-24" stroke-width="2.5"/>
</svg>`,
  },
  {
    id: 'obj-plant',
    title: '盆栽',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <rect x="148" y="190" width="104" height="16" rx="4"/>
  <path d="M156 206l8 56h72l8-56"/>
  <path d="M200 190c-2-40-14-62-34-78"/>
  <path d="M200 190c4-38 16-60 36-74"/>
  <path d="M200 190v-70"/>
  <ellipse cx="158" cy="104" rx="20" ry="11" transform="rotate(-32 158 104)"/>
  <ellipse cx="244" cy="108" rx="20" ry="11" transform="rotate(28 244 108)"/>
  <ellipse cx="200" cy="112" rx="12" ry="20"/>
  <ellipse cx="178" cy="140" rx="16" ry="9" transform="rotate(-24 178 140)"/>
  <ellipse cx="224" cy="142" rx="16" ry="9" transform="rotate(22 224 142)"/>
</svg>`,
  },
  {
    id: 'obj-house',
    title: '小房子',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M60 250h280"/>
  <rect x="120" y="150" width="160" height="100"/>
  <path d="M100 150L200 82l100 68"/>
  <path d="M238 138v-26h18v26" stroke-width="2.5"/>
  <rect x="172" y="196" width="40" height="54" stroke-width="2.5"/>
  <circle cx="203" cy="224" r="2.5" fill="currentColor" stroke="none"/>
  <rect x="136" y="170" width="34" height="34" stroke-width="2.5"/>
  <path d="M153 170v34M136 187h34" stroke-width="2"/>
</svg>`,
  },
  {
    id: 'obj-sailboat',
    title: '帆船',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M120 210h160l-26 42H146z"/>
  <path d="M200 210V70"/>
  <path d="M194 78v122h-58z" stroke-width="2.5"/>
  <path d="M206 92v104h58z" stroke-width="2.5"/>
  <path d="M70 262c14-10 28-10 42 0s28 10 42 0 28-10 42 0 28 10 42 0 28-10 42 0" stroke-width="2.5"/>
  <path d="M96 282c14-10 28-10 42 0s28 10 42 0 28-10 42 0" stroke-width="2.5"/>
</svg>`,
  },
];

/** 全部参考图 = 6 门课程的参考图 + 4 张静物线稿 */
export const allReferences: ReferenceItem[] = [
  ...courses.map((c) => c.reference),
  ...OBJECT_SVGS,
];

/** 按 id 查找参考图 */
export function getReference(id: string): ReferenceItem | undefined {
  return allReferences.find((r) => r.id === id);
}
