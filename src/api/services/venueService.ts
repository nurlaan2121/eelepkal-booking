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
        console.log("🚀 [getVenueReviews] START", { venueId, offset, limit });
        try {
            const response = await api.get<import('../dto/venueDto').VenueReview[]>(`/client-venue/feedbacks/${venueId}`, {
                params: { offset, limit }
            });
            console.log("✅ [getVenueReviews] SUCCESS", response.data);
            return response.data;
        } catch (error) {
            console.error("🔥 [getVenueReviews] ERROR", error);
            throw error;
        }
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
    },

    // 11. Menu Categories
    getMenuCategories: async (): Promise<import('../dto/venueDto').MenuCategory[]> => {
        const response = await api.get<import('../dto/venueDto').MenuCategory[]>('/dev/category/allIdAndName');
        return response.data;
    },

    // 12. Menu Items by Category
    getMenuItemsByCategory: async (venueId: string | number, categoryId: number, offset = 0, limit = 10): Promise<import('../dto/venueDto').MenuItem[]> => {
        const response = await api.get<import('../dto/venueDto').MenuItem[]>(`/client-menu/getByCategoryId/${venueId}/${categoryId}`, {
            params: { offset, limit }
        });
        return response.data;
    },

    // 13. Tables for Booking
    getTablesForBooking: async (params: {
        venueId: number;
        floor: number;
        countOfGuests: number;
        fullVisitTime: string;
        offset?: number;
        limit?: number;
    }): Promise<import('../dto/venueDto').TablesSchemaResponse> => {

        console.log("🚀 [getTablesForBooking] START");

        console.log("📤 RAW PARAMS:", params);

        if (!params.venueId) {
            console.error("❌ venueId is missing!", params);
            throw new Error("venueId is required");
        }

        const requestParams = {
            venueId: params.venueId,
            floor: params.floor,
            countOfGuests: params.countOfGuests,
            fullVisitTime: params.fullVisitTime,
            offset: params.offset ?? 0,
            limit: params.limit ?? 20,
        };

        console.log("📡 FINAL REQUEST PARAMS:", requestParams);

        try {
            const response = await api.get<
                import('../dto/venueDto').TablesSchemaResponse
            >('/client-table/get-all-tables-as-list-for-booking', {
                params: requestParams
            });

            console.log("✅ RESPONSE STATUS:", response.status);
            console.log("📥 RESPONSE DATA:", response.data);

            return response.data;

        } catch (error: any) {
            console.error("🔥 API ERROR:", error);

            if (error.response) {
                console.error("📉 STATUS:", error.response.status);
                console.error("📩 SERVER RESPONSE:", error.response.data);
            }

            throw error;
        }
    },

    // 14. Booking Conditions
    getBookingConditions: async (venueId: string | number): Promise<import('../dto/venueDto').BookingConditions> => {
        const response = await api.get<import('../dto/venueDto').BookingConditions>(`/guest-conditions/get/${venueId}`);
        return response.data;
    }
};
