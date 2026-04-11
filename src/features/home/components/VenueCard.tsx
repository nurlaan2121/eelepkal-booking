import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { RecommendedVenue } from '../../../api/dto/venueDto';
import FavoriteButton from '../../../components/ui/FavoriteButton';

interface VenueCardProps {
    venue: RecommendedVenue;
}


const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
    const navigate = useNavigate();

    return (
        <div style={styles.card} className="card-hover" onClick={() => navigate(`/venue/${venue.venueId}`)}>
            <div style={styles.imageContainer}>
                <img src={venue.firstImageUrl} alt={venue.venueName} style={styles.image} />
                <div style={styles.ratingBadge}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <span style={styles.ratingText}>{venue.rating.toFixed(1)}</span>
                </div>
                <FavoriteButton
                    id={venue.venueId}
                    type="venue"
                    initialIsFavorite={venue.favorite}
                    containerStyle={styles.favoriteBadge}
                />
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
        minWidth: '250px',
        maxWidth: '280px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    imageContainer: {
        position: 'relative',
        height: '150px',
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backdropFilter: 'blur(8px)',
        boxShadow: 'var(--shadow-sm)',
    },
    favoriteBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        backdropFilter: 'blur(8px)',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 2,
    },
    ratingText: {
        fontSize: '13px',
        fontWeight: '800',
        color: 'var(--color-text)',
    },
    info: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    name: {
        fontSize: '16px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        letterSpacing: '-0.3px',
    },
    cuisine: {
        fontSize: '13px',
        color: 'var(--color-primary)',
        fontWeight: '700',
        margin: 0,
    },
    addressRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '4px',
    },
    addressText: {
        fontSize: '13px',
        color: 'var(--color-text-muted)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export default VenueCard;
