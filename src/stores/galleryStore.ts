import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Artwork } from '@/types';
import { generateId } from '@/utils/id';

/** 画廊容量上限：缩略图 dataURL 体积不小，防止撑爆 localStorage */
export const MAX_ARTWORKS = 40;

interface GalleryState {
  artworks: Artwork[];
  /** 新增作品；画廊已满时返回 null */
  addArtwork: (artwork: Omit<Artwork, 'id' | 'createdAt'>) => Artwork | null;
  removeArtwork: (id: string) => void;
}

/** 作品画廊，仅存缩略图 dataURL，全部保存在本地 */
export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      artworks: [],
      addArtwork: (artwork) => {
        if (get().artworks.length >= MAX_ARTWORKS) return null;
        const created: Artwork = { ...artwork, id: generateId(), createdAt: Date.now() };
        set((s) =>
          s.artworks.length >= MAX_ARTWORKS ? s : { artworks: [created, ...s.artworks] },
        );
        return created;
      },
      removeArtwork: (id) => set((s) => ({ artworks: s.artworks.filter((a) => a.id !== id) })),
    }),
    { name: 'drawmate:gallery' },
  ),
);
