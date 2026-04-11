export enum BookingKind {
    ACTIVE = 'ACTIVE',
    HISTORY = 'HISTORY'
}

export interface BookingDTO {
    venueId: number;
    bookingId: number;
    venueName: string;
    firstImageUrl: string;
    rating: number;
    cuisine: string;
    address: string;
    bookingFullVisitTime: number; // timestamp
    bookingCreatedAd: number; // timestamp
    countOfGuests: number;
    inFloor: number;
    bookingStatus: string;
    etableTitle: string;
    etableType: string;
}
