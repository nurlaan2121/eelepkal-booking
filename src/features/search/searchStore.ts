import { create } from 'zustand';
import type { VenueSearchRequest } from '../../api/dto/venueDto';

interface SearchState {
    query: string;
    filters: VenueSearchRequest;

    // Actions
    setQuery: (query: string) => void;
    setFilters: (filters: Partial<VenueSearchRequest>) => void;
    resetFilters: () => void;
}

const defaultFilters: VenueSearchRequest = {
    minRating: undefined,
    minAverageCheck: undefined,
    maxAverageCheck: undefined,
};

export const useSearchStore = create<SearchState>((set) => ({
    query: '',
    filters: defaultFilters,

    setQuery: (query) => set({ query }),

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    resetFilters: () => set({ filters: defaultFilters }),
}));
