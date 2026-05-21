import { create } from 'zustand';

interface ImageStore {
    isOpen: boolean;
    imageUrl: string | null;
    openImage: (url: string) => void;
    closeImage: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
    isOpen: false,
    imageUrl: null,
    openImage: (url) => set({ isOpen: true, imageUrl: url }),
    closeImage: () => set({ isOpen: false, imageUrl: null }),
}));
