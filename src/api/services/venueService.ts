import api from '../instances/apiInstance';
import type { Cuisine, RecommendedVenue, FavoriteToggleResponse, VenueSearchRequest } from '../dto/venueDto';

export const venueService = {
    // Get Categories (Cuisines)
    getAllCuisines: async (offset = 0, limit = 4): Promise<Cuisine[]> => {
        const response = await api.get<Cuisine[]>('/dev/cuisine/all', {
            params: { offset, limit }
        });
        return response.data;
    },

    // Get Recommended Venues
    getRecommendedVenues: async (offset = 0, limit = 20): Promise<RecommendedVenue[]> => {
        const response = await api.get<RecommendedVenue[]>('/client-venue/get-recommended', {
            params: { offset, limit }
        });
        return response.data;
    },

    // Get Open Now Venues
    getOpenVenues: async (offset = 0, limit = 20): Promise<RecommendedVenue[]> => {
        const response = await api.get<RecommendedVenue[]>('/client-venue/get-opening', {
            params: { offset, limit }
        });
        return response.data;
    },

    // Get Top Rated Venues
    getTopRatedVenues: async (offset = 0, limit = 20): Promise<RecommendedVenue[]> => {
        const response = await api.get<RecommendedVenue[]>('/client-venue/get-rating', {
            params: { offset, limit }
        });
        return response.data;
    },

    // Toggle Favorite
    toggleFavorite: async (venueId: number): Promise<FavoriteToggleResponse> => {
        const response = await api.put<FavoriteToggleResponse>(`/client-venue/favourite-un-favourite/${venueId}`);
        return response.data;
    },

    // Search/Filter Venues
    searchVenues: async (
        word: string,
        filter: VenueSearchRequest = {},
        offset = 0,
        limit = 20
    ): Promise<RecommendedVenue[]> => {
        const response = await api.post<RecommendedVenue[]>('/client-venue/search', filter, {
            params: {
                word: word || undefined,
                offset,
                limit
            }
        });
        return response.data;
    }
};
