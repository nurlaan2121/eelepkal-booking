import React from 'react';

export enum FavoriteType {
    VENUES = 'venues',
    MENUS = 'menus'
}

interface FavoritesTabsProps {
    activeTab: FavoriteType;
    onChange: (type: FavoriteType) => void;
}

const FavoritesTabs: React.FC<FavoritesTabsProps> = ({ activeTab, onChange }) => {
    return (
        <div style={styles.container}>
            <button
                style={{
                    ...styles.tab,
                    ...(activeTab === FavoriteType.VENUES ? styles.activeTab : {}),
                }}
                onClick={() => onChange(FavoriteType.VENUES)}
            >
                Заведения
            </button>
            <button
                style={{
                    ...styles.tab,
                    ...(activeTab === FavoriteType.MENUS ? styles.activeTab : {}),
                }}
                onClick={() => onChange(FavoriteType.MENUS)}
            >
                Меню
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '20px',
    },
    tab: {
        flex: 1,
        padding: '12px 0',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        fontSize: '15px',
        fontWeight: '700',
        color: '#757575',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        color: '#FF9800',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
};

export default FavoritesTabs;
