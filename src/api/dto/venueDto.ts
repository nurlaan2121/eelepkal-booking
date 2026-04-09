export interface Cuisine {
    id: number;
    name: string;
    imageUrl: string;
}

export interface RecommendedVenue {
    venueId: number;
    venueName: string;
    firstImageUrl: string;
    rating: number;
    cuisine: string;
    address: string;
    favorite: boolean;
}

export interface Venue {
    venueId: number;
    cuisineId: number;
    image: string;
    name: string;
    rating: number;
    address: string;
}

export interface VenueSearchRequest {
    word?: string;
    minRating?: number;
    minAverageCheck?: number;
    maxAverageCheck?: number;
    venueAmenitiesIds?: number[];
    offset?: number;
    limit?: number;
}



export interface FavoriteToggleResponse {
    status: string;
    message: string;
}

export interface Promo {
    promoId: number;
    venueName: string;
    imageUrl: string;
    title: string;
    description: string;
    startEndDay: string;
    promoType: string;
    discount: number;
}

export interface VenueBasicInfo {
    venueId: number;
    images: Record<string, string>;
    name: string;
    todayWorkingHours: string;
    address: string;
    averageCheck: number;
    rating: number;
    promosRes: Promo[];
    favoriteForClient: boolean;
}

export interface VenueDetails {
    capacities: Record<string, number> | null;
    typesOfCuisines: string | null;
}

export interface VenueSchedule {
    MONDAY?: string;
    TUESDAY?: string;
    WEDNESDAY?: string;
    THURSDAY?: string;
    FRIDAY?: string;
    SATURDAY?: string;
    SUNDAY?: string;
}

export type VenueAmenities = Record<string, string>;

export interface VenueContacts {
    email?: string;
    phoneNumber?: string;
    instagram?: string;
    gis2?: string;
    telegram?: string;
}

export interface PublicAdmin {
    fullName?: string;
    phoneNumber?: string;
}

export interface Client {
    id: number;
    image: string | null;
    fullName: string;
}

export interface VenueReview {
    id: number;
    client: Client;
    text: string;
    rating: number;
    createdAt: string;
    isOwner: boolean;
}

export interface VenueFilial {
    id: number;
    name: string;
    address: string;
    rating: number;
    favorite: boolean;
}

export interface VenuePaymentDetails {
    id: number;
    venueTitle: string | null;
    taxIdentificationNumber: string | null;
    bankAccountNumber: string | null;
    bankName: string | null;
    qrcodeUrl: string | null;
}

export interface MenuCategory {
    id: number;
    name: string;
}

export interface MenuItem {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    favorite: boolean;
    addressVenue?: string;
    unit?: string;
    value?: string;
}

export interface TableItem {
    id: number;
    image: string;
    title: string;
    tableType: string;
    capacity: string;
    deposit: string;
    tableStatus: 'BUSY' | 'OPEN';
    recommendationForBooking: boolean;
}

export interface TablesSchemaResponse {
    tables: TableItem[];
    countOpen: number;
    countBusy: number;
    countForYou: number;
}

export interface TableDetails {
    id: number;
    images: Record<string, string>;
    title: string;
    tableType: string;
    description: string;
    deposit: string;
    capacity: string;
    eventTypes: string[];
    amenities: string[];
    status: 'OPEN' | 'BUSY';
}

export interface BookingConditions {
    cancellationDeadline: number[] | null;
    editingDeadline: number[] | null;
    cancellationAllowed: boolean;
    editingAllowed: boolean;
    withADeposit: boolean;
    deposit: number | null;
}
