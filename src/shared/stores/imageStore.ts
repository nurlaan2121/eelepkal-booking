import { create } from 'zustand';

interface ImageStore {
    isOpen: boolean;
    images: string[];
    currentIndex: number;
    openImage: (index: number, images: string[]) => void;
    nextImage: () => void;
    prevImage: () => void;
    closeImage: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
    isOpen: false,
    images: [],
    currentIndex: 0,
    openImage: (index, images) => set({ isOpen: true, images, currentIndex: index }),
    nextImage: () => set((state) => ({
        currentIndex: (state.currentIndex + 1) % state.images.length
    })),
    prevImage: () => set((state) => ({
        currentIndex: (state.currentIndex - 1 + state.images.length) % state.images.length
    })),
    closeImage: () => set({ isOpen: false, images: [], currentIndex: 0 }),
}));
