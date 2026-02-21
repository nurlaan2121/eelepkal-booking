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
    minRating?: number;
    minAverageCheck?: number;
    maxAverageCheck?: number;
    venueAmenitiesIds?: number[];
}

export interface FavoriteToggleResponse {
    status: string;
    message: string;
}
