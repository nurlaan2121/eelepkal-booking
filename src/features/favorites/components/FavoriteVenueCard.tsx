import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { FavoriteVenue } from '../../../api/dto/venueDto';

interface FavoriteVenueCardProps {
    venue: FavoriteVenue;
}

const FavoriteVenueCard: React.FC<FavoriteVenueCardProps> = ({ venue }) => {
    const navigate = useNavigate();
    const isInactive = venue.status === 'INACTIVE';

    const handleClick = () => {
        if (!isInactive) {
            navigate(`/venue/${venue.venueId}`);
        }
    };

    return (
        <div
            style={{
                ...styles.card,
                opacity: isInactive ? 0.7 : 1,
                cursor: isInactive ? 'not-allowed' : 'pointer',
                filter: isInactive ? 'grayscale(0.8)' : 'none'
            }}
            onClick={handleClick}
        >
            <div style={styles.imageContainer}>
                <img src={venue.firstImageUrl} alt={venue.venueName} style={styles.image} />
                {isInactive && (
                    <div style={styles.inactiveOverlay}>
                        <span style={styles.inactiveText}>Недоступно</span>
                    </div>
                )}
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
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    imageContainer: {
        position: 'relative',
        height: '160px',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    inactiveOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    inactiveText: {
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: '700',
        padding: '6px 12px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: '8px',
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
        zIndex: 2,
    },
    ratingText: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#000000',
    },
    info: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    name: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#000000',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    cuisine: {
        fontSize: '14px',
        color: '#FF9800',
        fontWeight: '600',
        margin: 0,
    },
    addressRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '6px',
    },
    addressText: {
        fontSize: '13px',
        color: '#757575',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export default FavoriteVenueCard;
