import { create } from 'zustand';

interface FavoritesState {
    venueFavorites: Record<number, boolean>;
    menuFavorites: Record<number, boolean>;
    setVenueFavorite: (id: number, isFavorite: boolean) => void;
    setMenuFavorite: (id: number, isFavorite: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>((set) => ({
    venueFavorites: {},
    menuFavorites: {},
    setVenueFavorite: (id, isFavorite) => set((state) => ({
        venueFavorites: { ...state.venueFavorites, [id]: isFavorite }
    })),
    setMenuFavorite: (id, isFavorite) => set((state) => ({
        menuFavorites: { ...state.menuFavorites, [id]: isFavorite }
    }))
}));
