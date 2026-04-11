import React from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { venueService } from '../../../api/services/venueService';
import FavoriteButton from '../../../components/ui/FavoriteButton';
import InfiniteScrollList from '../../../components/ui/InfiniteScrollList';
import MenuItemDetailsModal from './MenuItemDetailsModal';
import type { MenuItem } from '../../../api/dto/venueDto';
import { UtensilsCrossed } from 'lucide-react';

const LIMIT = 10;

interface VenueMenuSectionProps {
    venueId: string | number;
}

const VenueMenuSection: React.FC<VenueMenuSectionProps> = ({ venueId }) => {
    const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
    const [selectedMenuId, setSelectedMenuId] = React.useState<number | null>(null);

    const categoriesQuery = useQuery({
        queryKey: ['menuCategories'],
        queryFn: () => venueService.getMenuCategories(),
    });

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['menuItems', venueId, selectedCategoryId],
        queryFn: ({ pageParam = 0 }) =>
            venueService.getMenuItemsByCategory(venueId, selectedCategoryId!, pageParam, LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === LIMIT ? allPages.length * LIMIT : undefined,
        enabled: !!selectedCategoryId && !!venueId,
    });

    React.useEffect(() => {
        if (categoriesQuery.data && categoriesQuery.data.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categoriesQuery.data[0].id);
        }
    }, [categoriesQuery.data, selectedCategoryId]);

    const menuItems: MenuItem[] = data?.pages.flat() ?? [];

    if (categoriesQuery.isLoading) {
        return (
            <div style={styles.container}>
                <div style={styles.categoryBarSkeleton}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={styles.chipSkeleton} className="animate-pulse" />
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={styles.rowSkeleton} className="animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Category Tabs */}
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

            {/* Menu Items with Infinite Scroll */}
            <InfiniteScrollList<MenuItem>
                items={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={(item) => (
                    <div
                        style={styles.menuCard}
                        onClick={() => setSelectedMenuId(item.id)}
                    >
                        <img src={item.imageUrl} alt={item.name} style={styles.itemImage} />
                        <div style={styles.itemInfo}>
                            <h4 style={styles.itemName}>{item.name}</h4>
                            <p style={styles.itemDesc}>{item.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={styles.itemPrice}>{item.price} KGS</span>
                                <FavoriteButton
                                    id={item.id}
                                    type="menu"
                                    initialIsFavorite={item.favorite}
                                    size={20}
                                />
                            </div>
                        </div>
                    </div>
                )}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
                onLoadMore={fetchNextPage}
                gap={12}
                emptyState={
                    <div style={styles.emptyState}>
                        <UtensilsCrossed size={40} color="#E0E0E0" />
                        <p style={styles.emptyText}>В этой категории пока ничего нет</p>
                    </div>
                }
                skeleton={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={styles.rowSkeleton} className="animate-pulse" />
                        ))}
                    </div>
                }
            />

            {selectedMenuId && (
                <MenuItemDetailsModal
                    menuId={selectedMenuId}
                    onClose={() => setSelectedMenuId(null)}
                />
            )}
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
        flexShrink: 0,
    },
    menuCard: {
        display: 'flex',
        gap: '16px',
        padding: '12px',
        borderRadius: '16px',
        backgroundColor: '#F9F9F9',
        border: '1px solid #F0F0F0',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
    },
    itemImage: {
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        objectFit: 'cover',
        flexShrink: 0,
    },
    itemInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        minWidth: 0,
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
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    itemPrice: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#FF9800',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 0',
        gap: '12px',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9E9E9E',
        fontSize: '15px',
        margin: 0,
    },
    categoryBarSkeleton: {
        display: 'flex',
        gap: '12px',
        padding: '8px 0',
        marginBottom: '20px',
    },
    chipSkeleton: {
        width: '90px',
        height: '36px',
        borderRadius: '20px',
        backgroundColor: '#F0F0F0',
    },
    rowSkeleton: {
        height: '104px',
        borderRadius: '16px',
        backgroundColor: '#F0F0F0',
    },
};

export default VenueMenuSection;
