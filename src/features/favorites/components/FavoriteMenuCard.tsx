import React from 'react';
import type { FavoriteMenu } from '../../../api/dto/venueDto';

interface FavoriteMenuCardProps {
    menuItem: FavoriteMenu;
}

const FavoriteMenuCard: React.FC<FavoriteMenuCardProps> = ({ menuItem }) => {
    const isInactive = menuItem.status === 'INACTIVE';

    // Since we don't have a direct link to menu item detail page yet based on current routing,
    // we could navigate to the venue page, but for now we follow the same logic as VenueCard.
    // If there's no menu detail route, we might just show info.
    const handleClick = () => {
        // Option: Navigate to venue if needed, or if menuItem has venueId (not in DTO though)
        // For now, let's keep it simple.
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
                <img src={menuItem.imageUrl} alt={menuItem.name} style={styles.image} />
                {isInactive && (
                    <div style={styles.inactiveOverlay}>
                        <span style={styles.inactiveText}>Недоступно</span>
                    </div>
                )}
            </div>

            <div style={styles.info}>
                <div style={styles.titleRow}>
                    <h3 style={styles.name}>{menuItem.name}</h3>
                    <span style={styles.price}>{menuItem.price} ₸</span>
                </div>

                <p style={styles.description}>
                    {menuItem.description}
                </p>

                <div style={styles.venueRow}>
                    <div style={styles.logoContainer}>
                        <img src={menuItem.venueLogoUrl} alt={menuItem.from} style={styles.venueLogo} />
                    </div>
                    <span style={styles.venueName}>{menuItem.from}</span>
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
        display: 'flex',
        flexDirection: 'column',
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
    info: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
    },
    titleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '8px',
    },
    name: {
        fontSize: '17px',
        fontWeight: '700',
        color: '#000000',
        margin: 0,
        lineHeight: '1.2',
    },
    price: {
        fontSize: '16px',
        fontWeight: '800',
        color: '#2E7D32',
        whiteSpace: 'nowrap',
    },
    description: {
        fontSize: '14px',
        color: '#757575',
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: '1.4',
        minHeight: '2.8em',
    },
    venueRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: 'auto',
        paddingTop: '8px',
        borderTop: '1px solid #f0f0f0',
    },
    logoContainer: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    venueLogo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    venueName: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#424242',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export default FavoriteMenuCard;
