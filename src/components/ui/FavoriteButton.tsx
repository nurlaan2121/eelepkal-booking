import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoriteToggle } from '../../hooks/useFavoriteToggle';

interface FavoriteButtonProps {
    id: number;
    type: 'venue' | 'menu';
    initialIsFavorite?: boolean;
    size?: number;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ id, type, initialIsFavorite, size = 20, style, containerStyle }) => {
    const { isFavourite, isLoadingFavourite, toggle } = useFavoriteToggle({ id, type, initialIsFavorite });

    return (
        <button
            onClick={toggle}
            disabled={isLoadingFavourite}
            style={{
                ...styles.button,
                opacity: isLoadingFavourite ? 0.7 : 1,
                transform: isLoadingFavourite ? 'scale(0.95)' : 'scale(1)',
                cursor: isLoadingFavourite ? 'not-allowed' : 'pointer',
                ...containerStyle
            }}
        >
            <Heart
                size={size}
                color={isFavourite ? "#F44336" : "#757575"}
                fill={isFavourite ? "#F44336" : "transparent"}
                style={{
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    ...style
                }}
            />
        </button>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        background: 'none',
        border: 'none',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        WebkitTapHighlightColor: 'transparent',
    }
};

export default FavoriteButton;
