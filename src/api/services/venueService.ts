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
        const response = await api.post<RecommendedVenue[]>('/client-venue/search', {
            ...filter,
            word: word || undefined,
            offset,
            limit
        });
        return response.data;
    },

    // 1. Basic Information
    getVenueBasic: async (venueId: string | number): Promise<import('../dto/venueDto').VenueBasicInfo> => {
        const response = await api.get<import('../dto/venueDto').VenueBasicInfo>(`/client-venue/venue-get-basic/${venueId}`);
        return response.data;
    },

    // 2. Details (main block)
    getVenueDetails: async (venueId: string | number): Promise<import('../dto/venueDto').VenueDetails> => {
        const response = await api.get<import('../dto/venueDto').VenueDetails>(`/client-venue/venue-get-details/${venueId}`);
        return response.data;
    },

    // 3. Working Hours
    getVenueHours: async (venueId: string | number): Promise<import('../dto/venueDto').VenueSchedule> => {
        const response = await api.get<import('../dto/venueDto').VenueSchedule>(`/client-venue/get-hours/${venueId}`);
        return response.data;
    },

    // 4. Amenities
    getVenueAmenities: async (venueId: string | number): Promise<import('../dto/venueDto').VenueAmenities> => {
        const response = await api.get<import('../dto/venueDto').VenueAmenities>(`/client-venue/get-amenities/${venueId}`);
        return response.data;
    },

    // 5. Contacts
    getVenueContacts: async (venueId: string | number): Promise<import('../dto/venueDto').VenueContacts> => {
        const response = await api.get<import('../dto/venueDto').VenueContacts>(`/client-venue/get-contacts/${venueId}`);
        return response.data;
    },

    // 6. Public Admin
    getVenueAdmin: async (venueId: string | number): Promise<import('../dto/venueDto').PublicAdmin> => {
        const response = await api.get<import('../dto/venueDto').PublicAdmin>(`/client-venue/get-public-admin/${venueId}`);
        return response.data;
    },

    // 7. Description
    getVenueDescription: async (venueId: string | number): Promise<string> => {
        const response = await api.get<string>(`/client-venue/get-description/${venueId}`);
        return response.data;
    },

    // 8. Feedbacks
    getVenueReviews: async (venueId: string | number, offset = 0, limit = 20): Promise<import('../dto/venueDto').VenueReview[]> => {
        const response = await api.get<import('../dto/venueDto').VenueReview[]>(`/client-venue/feedbacks/${venueId}`, {
            params: { offset, limit }
        });
        return response.data;
    },

    // 9. Filials
    getVenueFilials: async (venueId: string | number, offset = 0, limit = 20): Promise<import('../dto/venueDto').VenueFilial[]> => {
        const response = await api.get<import('../dto/venueDto').VenueFilial[]>(`/client-venue/get-filials/${venueId}`, {
            params: { offset, limit }
        });
        return response.data;
    },

    // 10. Payment Details
    getPaymentDetails: async (venueId: string | number): Promise<import('../dto/venueDto').VenuePaymentDetails[]> => {
        const response = await api.get<import('../dto/venueDto').VenuePaymentDetails[]>(`/client-venue/payment/get-all-payment-details/${venueId}`);
        return response.data;
    }
};
