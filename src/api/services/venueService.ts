import api from '../instances/apiInstance';
import { useAuthStore } from '../../features/auth/authStore';
import type { Cuisine, RecommendedVenue, FavoriteToggleResponse, VenueSearchRequest, TableDetails, TablesSchemaResponse, BookingConditions, VenueBasicInfo, VenueDetails, VenueSchedule, VenueAmenities, VenueContacts, PublicAdmin, VenueReview, VenueFilial, VenuePaymentDetails, MenuCategory, MenuItem, BookingRequest, BookingResponse, S3Response, VenueWorkingStatusResponse, FavoriteMenu, FavoriteVenue, Amenity, ReviewRequest } from '../dto/venueDto';

export const venueService = {
    // Get Categories (Cuisines)
    getAllCuisines: async (offset = 0, limit = 8): Promise<Cuisine[]> => {
        const response = await api.get<Cuisine[]>('/dev/cuisine/all', {
            params: { offset, limit }
        });
        return response.data;
    },

    // Get Recommended Venues
    getRecommendedVenues: async (offset = 0, limit = 20): Promise<RecommendedVenue[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? '/client-venue/get-recommended' : '/guest-venue/get-recommended';
        const response = await api.get<RecommendedVenue[]>(endpoint, {
            params: { offset, limit }
        });
        return response.data;
    },

    // Get Open Now Venues
    getOpenVenues: async (offset = 0, limit = 20): Promise<RecommendedVenue[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? '/client-venue/get-opening' : '/guest-venue/get-opening';
        const response = await api.get<RecommendedVenue[]>(endpoint, {
            params: { offset, limit }
        });
        return response.data;
    },

    // Get Top Rated Venues
    getTopRatedVenues: async (offset = 0, limit = 20): Promise<RecommendedVenue[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? '/client-venue/get-rating' : '/guest-venue/get-rating';
        const response = await api.get<RecommendedVenue[]>(endpoint, {
            params: { offset, limit }
        });
        return response.data;
    },

    // Toggle Favorite
    toggleVenueFavourite: async (venueId: number): Promise<FavoriteToggleResponse> => {
        const response = await api.put<FavoriteToggleResponse>(`/client-venue/favourite-un-favourite/${venueId}`);
        return response.data;
    },

    toggleMenuFavourite: async (menuId: number): Promise<FavoriteToggleResponse> => {
        const response = await api.put<FavoriteToggleResponse>(`/client-menu/favourite-un-favourite/${menuId}`);
        return response.data;
    },

    // Search/Filter Venues
    searchVenues: async (
        word: string,
        filter: VenueSearchRequest = {},
        offset = 0,
        limit = 20
    ): Promise<RecommendedVenue[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? '/client-venue/search' : '/guest-venue/search';

        const params = {
            word: word || undefined,
            offset,
            limit
        };
        const data = {
            minRating: filter.minRating,
            minAverageCheck: filter.minAverageCheck,
            maxAverageCheck: filter.maxAverageCheck,
            venueAmenitiesIds: filter.venueAmenitiesIds || [],
        };
        const response = await api.post<RecommendedVenue[]>(endpoint, data, {
            params
        });
        return response.data;
    },

    getAllAmenities: async (): Promise<Amenity[]> => {
        const response = await api.get<Amenity[]>('/dev/amenities/allForUpdate');
        return response.data;
    },

    // 1. Basic Information
    getVenueBasic: async (venueId: string | number): Promise<VenueBasicInfo> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/venue-get-basic/${venueId}` : `/guest-venue/venue-get-basic/${venueId}`;
        const response = await api.get<VenueBasicInfo>(endpoint);
        return response.data;
    },

    // 2. Details (main block)
    getVenueDetails: async (venueId: string | number): Promise<VenueDetails> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/venue-get-details/${venueId}` : `/guest-venue/venue-get-details/${venueId}`;
        const response = await api.get<VenueDetails>(endpoint);
        return response.data;
    },

    getTableDetails: async (tableId: number | string, fullVisitTime: string): Promise<TableDetails> => {
        // Extract only the date part (YYYY-MM-DD) as the server expects LocalDate
        const dateOnly = fullVisitTime.split('T')[0];
        const response = await api.get<TableDetails>(`/client-table/get/${tableId}`, {
            params: { fullVisitTime: dateOnly }
        });
        return response.data;
    },

    getVenueHours: async (venueId: string | number): Promise<VenueSchedule> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/get-hours/${venueId}` : `/guest-venue/get-hours/${venueId}`;
        const response = await api.get<VenueSchedule>(endpoint);
        return response.data;
    },

    // 4. Amenities
    getVenueAmenities: async (venueId: string | number): Promise<VenueAmenities> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/get-amenities/${venueId}` : `/guest-venue/get-amenities/${venueId}`;
        const response = await api.get<VenueAmenities>(endpoint);
        return response.data;
    },

    // 5. Contacts
    getVenueContacts: async (venueId: string | number): Promise<VenueContacts> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/get-contacts/${venueId}` : `/guest-venue/get-contacts/${venueId}`;
        const response = await api.get<VenueContacts>(endpoint);
        return response.data;
    },

    // 6. Public Admin
    getVenueAdmin: async (venueId: string | number): Promise<PublicAdmin> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/get-public-admin/${venueId}` : `/guest-venue/get-public-admin/${venueId}`;
        const response = await api.get<PublicAdmin>(endpoint);
        return response.data;
    },

    // 7. Description
    getVenueDescription: async (venueId: string | number): Promise<string> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/get-description/${venueId}` : `/guest-venue/get-description/${venueId}`;
        const response = await api.get<string>(endpoint);
        return response.data;
    },

    // 8. Feedbacks
    getVenueReviews: async (venueId: string | number, offset = 0, limit = 20): Promise<VenueReview[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/feedbacks/${venueId}` : `/guest-venue/feedbacks/${venueId}`;
        console.log("🚀 [getVenueReviews] START", { venueId, offset, limit, endpoint });
        try {
            const response = await api.get<VenueReview[]>(endpoint, {
                params: { offset, limit }
            });
            console.log("✅ [getVenueReviews] SUCCESS", response.data);
            return response.data;
        } catch (error) {
            console.error("🔥 [getVenueReviews] ERROR", error);
            throw error;
        }
    },

    addVenueReview: async (venueId: string | number, data: ReviewRequest): Promise<any> => {
        const response = await api.post(`/client-feedback/add/${venueId}`, data);
        return response.data;
    },

    // 9. Filials
    getVenueFilials: async (venueId: string | number, offset = 0, limit = 20): Promise<VenueFilial[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-venue/get-filials/${venueId}` : `/guest-venue/get-filials/${venueId}`;
        const response = await api.get<VenueFilial[]>(endpoint, {
            params: { offset, limit }
        });
        return response.data;
    },

    // 10. Payment Details
    getPaymentDetails: async (venueId: string | number): Promise<VenuePaymentDetails[]> => {
        const response = await api.get<VenuePaymentDetails[]>(`/client-venue/payment/get-all-payment-details/${venueId}`);
        return response.data;
    },

    // 11. Menu Categories
    getMenuCategories: async (): Promise<MenuCategory[]> => {
        const response = await api.get<MenuCategory[]>('/dev/category/allIdAndName');
        return response.data;
    },

    // 12. Menu Items by Category
    getMenuItemsByCategory: async (venueId: string | number, categoryId: number, offset = 0, limit = 10): Promise<MenuItem[]> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated
            ? `/client-menu/getByCategoryId/${venueId}/${categoryId}`
            : `/guest-menu/getByCategoryId/${venueId}/${categoryId}`;

        const response = await api.get<MenuItem[]>(endpoint, {
            params: { offset, limit }
        });
        return response.data;
    },

    // 12b. Menu Item Details
    getMenuItemById: async (menuId: number | string): Promise<MenuItem> => {
        const { isAuthenticated } = useAuthStore.getState();
        const endpoint = isAuthenticated ? `/client-menu/get/${menuId}` : `/guest-menu/get/${menuId}`;
        const response = await api.get<MenuItem>(endpoint);
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
    }): Promise<TablesSchemaResponse> => {

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
            // This endpoint requires ZonedDateTime (full timestamp)
            fullVisitTime: params.fullVisitTime,
            offset: params.offset ?? 0,
            limit: params.limit ?? 20,
        };

        console.log("📡 FINAL REQUEST PARAMS:", requestParams);

        try {
            const response = await api.get<TablesSchemaResponse>('/client-table/get-all-tables-as-list-for-booking', {
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
    getBookingConditions: async (venueId: string | number): Promise<BookingConditions> => {
        const response = await api.get<BookingConditions>(`/guest-conditions/get/${venueId}`);
        return response.data;
    },

    bookTable: async (tableId: number, data: BookingRequest): Promise<BookingResponse> => {
        const response = await api.post<BookingResponse>(`/client-table/booking/${tableId}`, data);
        return response.data;
    },

    // 16. Upload file to S3
    uploadReceipt: async (file: File): Promise<S3Response> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<S3Response>('/s3', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // 17. Bind receipt to booking
    assignReceiptToBooking: async (bookingId: number, chequeUrl: string): Promise<any> => {
        const response = await api.post(`/client-conditions/assign-to-booking/${bookingId}`, null, {
            params: { chequeUrl }
        });
        return response.data;
    },

    checkIsWorking: async (venueId: string | number, fullVisitTime: string): Promise<VenueWorkingStatusResponse> => {
        const response = await api.post<VenueWorkingStatusResponse>(`/client-venue/check-is-working/${venueId}`, null, {
            params: { fullVisitTime }
        });
        return response.data;
    },

    // 18. Favourites
    getFavouriteVenues: async (offset = 0, limit = 20): Promise<FavoriteVenue[]> => {
        const response = await api.get<FavoriteVenue[]>('/client-venue/get-favourites', {
            params: { offset, limit }
        });
        return response.data;
    },

    getFavouriteMenus: async (offset = 0, limit = 20): Promise<FavoriteMenu[]> => {
        const response = await api.get<FavoriteMenu[]>('/client-menu/get-favourites', {
            params: { offset, limit }
        });
        return response.data;
    }
};
