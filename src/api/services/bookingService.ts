import api from '../instances/apiInstance';
import { BookingDTO, BookingKind } from '../dto/bookingDto';

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
    }
};
