import React from 'react';
import { Star, Share2 } from 'lucide-react';
import type { VenueBasicInfo } from '../../../api/dto/venueDto';
import FavoriteButton from '../../../components/ui/FavoriteButton';

interface VenueHeaderProps {
    venue: VenueBasicInfo;
    isFavorite: boolean;
    onShare: () => void;
}

const VenueHeader: React.FC<VenueHeaderProps> = ({ venue, isFavorite, onShare }) => {
    const images = Object.values(venue.images);
    const [activeImage, setActiveImage] = React.useState(images[0] || '');

    return (
        <div style={styles.header}>
            <div style={styles.mainImageContainer}>
                <img src={activeImage} alt={venue.name} style={styles.mainImage} />

                <div style={styles.actionButtons}>
                    <button onClick={onShare} style={styles.iconButton}>
                        <Share2 size={20} color="#000" />
                    </button>
                    <FavoriteButton
                        id={venue.venueId}
                        type="venue"
                        initialIsFavorite={isFavorite}
                        containerStyle={styles.iconButton}
                    />
                </div>

                <div style={styles.ratingBadge}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <span style={styles.ratingText}>{venue.rating.toFixed(1)}</span>
                </div>
            </div>

            <div style={styles.thumbGallery}>
                {images.slice(0, 5).map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`${venue.name} thumb ${idx}`}
                        style={{
                            ...styles.thumbnail,
                            border: activeImage === img ? '2px solid #FF9800' : '2px solid transparent'
                        }}
                        onClick={() => setActiveImage(img)}
                    />
                ))}
            </div>

            <div style={styles.titleRow}>
                <h1 style={styles.name}>{venue.name}</h1>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    header: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
    },
    mainImageContainer: {
        position: 'relative',
        height: '300px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    actionButtons: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        gap: '12px',
    },
    iconButton: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(4px)',
        transition: 'transform 0.2s',
    },
    ratingBadge: {
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 16px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    ratingText: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#000000',
    },
    thumbGallery: {
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        padding: '4px 0',
        scrollbarWidth: 'none',
    },
    thumbnail: {
        width: '80px',
        height: '60px',
        borderRadius: '12px',
        objectFit: 'cover',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.2s',
    },
    titleRow: {
        marginTop: '8px',
    },
    name: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#000',
        margin: 0,
        letterSpacing: '-0.5px',
    },
};

export default VenueHeader;
