import api from '../instances/apiInstance';
import { BookingDTO, BookingKind, BookingDetailsDTO } from '../dto/bookingDto';

export const bookingService = {
    /**
     * Get all bookings for the current client.
     * 
     * @param bookingKinds - ACTIVE or HISTORY
     * @param offset - Pagination offset
     * @param limit - Pagination limit
     */
    getAllBookings: async (
        bookingKinds: BookingKind,
        offset = 0,
        limit = 10
    ): Promise<BookingDTO[]> => {
        const response = await api.get<BookingDTO[]>('/client-booking/get-all', {
            params: {
                bookingKinds,
                offset,
                limit
            }
        });
        return response.data;
    },

    /**
     * Get a single booking by its ID.
     * 
     * @param bookingId - The ID of the booking
     */
    getBookingById: async (bookingId: number | string): Promise<BookingDetailsDTO> => {
        console.log(`🚀 [getBookingById] START - ID: ${bookingId}`);
        try {
            const response = await api.get<BookingDetailsDTO>(`/client-booking/get/${bookingId}`);
            console.log(`✅ [getBookingById] SUCCESS`, response.data);
            return response.data;
        } catch (error: any) {
            console.error(`🔥 [getBookingById] ERROR`, error);
            if (error.response) {
                console.error(`📉 STATUS: ${error.response.status}`, error.response.data);
            }
            throw error;
        }
    }
};
