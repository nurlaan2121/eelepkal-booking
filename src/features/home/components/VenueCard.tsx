import React from 'react';
import { Star, MapPin } from 'lucide-react';
import type { RecommendedVenue } from '../../../api/dto/venueDto';

interface VenueCardProps {
    venue: RecommendedVenue;
    onClick?: () => void;
}


const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick }) => {
    return (
        <div style={styles.card} onClick={onClick}>
            <div style={styles.imageContainer}>
                <img src={venue.firstImageUrl} alt={venue.venueName} style={styles.image} />
                <div style={styles.ratingBadge}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <span style={styles.ratingText}>{venue.rating.toFixed(1)}</span>
                </div>
            </div>

            <div style={styles.info}>
                <h3 style={styles.name}>{venue.venueName}</h3>
                <p style={styles.cuisine}>{venue.cuisine}</p>

                <div style={styles.addressRow}>
                    <MapPin size={14} color="#757575" />
                    <span style={styles.addressText}>{venue.address}</span>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        minWidth: '240px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        flexShrink: 0,
    },
    imageContainer: {
        position: 'relative',
        height: '140px',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    ratingBadge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 8px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backdropFilter: 'blur(4px)',
    },
    ratingText: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#000000',
    },
    info: {
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    name: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#000000',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    cuisine: {
        fontSize: '13px',
        color: '#FF9800',
        fontWeight: '600',
        margin: 0,
    },
    addressRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '4px',
    },
    addressText: {
        fontSize: '12px',
        color: '#757575',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export default VenueCard;
