import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { venueService } from '../../../api/services/venueService';

interface VenueMenuSectionProps {
    venueId: string | number;
}

const VenueMenuSection: React.FC<VenueMenuSectionProps> = ({ venueId }) => {
    const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);

    const categoriesQuery = useQuery({
        queryKey: ['menuCategories'],
        queryFn: () => venueService.getMenuCategories(),
    });

    const menuItemsQuery = useQuery({
        queryKey: ['menuItems', venueId, selectedCategoryId],
        queryFn: () => venueService.getMenuItemsByCategory(venueId, selectedCategoryId!),
        enabled: !!selectedCategoryId && !!venueId,
    });

    React.useEffect(() => {
        if (categoriesQuery.data && categoriesQuery.data.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categoriesQuery.data[0].id);
        }
    }, [categoriesQuery.data, selectedCategoryId]);

    if (categoriesQuery.isLoading) return <div>Загрузка категорий...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.categoryBar}>
                {categoriesQuery.data?.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        style={{
                            ...styles.categoryChip,
                            backgroundColor: selectedCategoryId === cat.id ? '#FF9800' : '#F5F5F5',
                            color: selectedCategoryId === cat.id ? '#FFF' : '#757575',
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div style={styles.menuGrid}>
                {menuItemsQuery.isLoading ? (
                    <div>Загрузка меню...</div>
                ) : menuItemsQuery.data?.length === 0 ? (
                    <div style={styles.empty}>В этой категории пока ничего нет</div>
                ) : (
                    menuItemsQuery.data?.map((item) => (
                        <div key={item.id} style={styles.menuCard}>
                            <img src={item.imageUrl} alt={item.name} style={styles.itemImage} />
                            <div style={styles.itemInfo}>
                                <h4 style={styles.itemName}>{item.name}</h4>
                                <p style={styles.itemDesc}>{item.description}</p>
                                <span style={styles.itemPrice}>{item.price} KGS</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        marginTop: '16px',
    },
    categoryBar: {
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        padding: '8px 0',
        marginBottom: '20px',
        scrollbarWidth: 'none',
    },
    categoryChip: {
        padding: '8px 20px',
        borderRadius: '20px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
    },
    menuGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    menuCard: {
        display: 'flex',
        gap: '16px',
        padding: '12px',
        borderRadius: '16px',
        backgroundColor: '#F9F9F9',
        border: '1px solid #F0F0F0',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        objectFit: 'cover',
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    itemName: {
        margin: '0 0 4px 0',
        fontSize: '16px',
        fontWeight: '700',
        color: '#212121',
    },
    itemDesc: {
        margin: '0 0 8px 0',
        fontSize: '12px',
        color: '#757575',
        lineHeight: '1.4',
    },
    itemPrice: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#FF9800',
    },
    empty: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#9E9E9E',
    },
};

export default VenueMenuSection;
