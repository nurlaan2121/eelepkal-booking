import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { venueService } from '../../api/services/venueService';
import FavoritesTabs, { FavoriteType } from './components/FavoritesTabs';
import FavoriteVenueCard from './components/FavoriteVenueCard';
import FavoriteMenuCard from './components/FavoriteMenuCard';
import InfiniteScrollList from '../../components/ui/InfiniteScrollList';
import type { FavoriteVenue, FavoriteMenu } from '../../api/dto/venueDto';
import { Heart, ArrowRight, AlertCircle } from 'lucide-react';

const LIMIT = 10;

const FavoritesScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FavoriteType>(FavoriteType.VENUES);
    const navigate = useNavigate();

    const {
        data: venuesData,
        fetchNextPage: fetchNextVenues,
        hasNextPage: hasMoreVenues,
        isFetchingNextPage: isFetchingMoreVenues,
        isLoading: isLoadingVenues,
        isError: isErrorVenues,
        refetch: refetchVenues,
    } = useInfiniteQuery({
        queryKey: ['favourite-venues'],
        queryFn: ({ pageParam = 0 }) => venueService.getFavouriteVenues(pageParam, LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === LIMIT ? allPages.length * LIMIT : undefined,
        enabled: activeTab === FavoriteType.VENUES,
    });

    const {
        data: menusData,
        fetchNextPage: fetchNextMenus,
        hasNextPage: hasMoreMenus,
        isFetchingNextPage: isFetchingMoreMenus,
        isLoading: isLoadingMenus,
        isError: isErrorMenus,
        refetch: refetchMenus,
    } = useInfiniteQuery({
        queryKey: ['favourite-menus'],
        queryFn: ({ pageParam = 0 }) => venueService.getFavouriteMenus(pageParam, LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === LIMIT ? allPages.length * LIMIT : undefined,
        enabled: activeTab === FavoriteType.MENUS,
    });

    const venues: FavoriteVenue[] = venuesData?.pages.flat() ?? [];
    const menus: FavoriteMenu[] = menusData?.pages.flat() ?? [];

    const isLoading = activeTab === FavoriteType.VENUES ? isLoadingVenues : isLoadingMenus;
    const isError = activeTab === FavoriteType.VENUES ? isErrorVenues : isErrorMenus;
    const refetch = activeTab === FavoriteType.VENUES ? refetchVenues : refetchMenus;

    const emptyState = (
        <div style={styles.emptyContainer}>
            <div style={styles.heartIconCircle}>
                <Heart size={40} color="#BDBDBD" />
            </div>
            <h2 style={styles.emptyTitle}>У вас пока нет избранного</h2>
            <p style={styles.emptySubtitle}>
                Сохраняйте заведения и блюда, чтобы они всегда были под рукой
            </p>
            <button style={styles.searchButton} onClick={() => navigate('/search')}>
                Перейти к поиску
                <ArrowRight size={18} />
            </button>
        </div>
    );

    const errorState = (
        <div style={styles.centerContainer}>
            <AlertCircle size={48} color="#F44336" />
            <p style={styles.errorText}>Произошла ошибка при загрузке</p>
            <button style={styles.retryButton} onClick={() => refetch()}>
                Повторить
            </button>
        </div>
    );

    const skeleton = (
        <div style={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} style={styles.skeletonCard}>
                    <div style={styles.skeletonImage} className="animate-pulse" />
                    <div style={styles.skeletonContent}>
                        <div style={{ ...styles.skeletonLine, width: '70%' }} className="animate-pulse" />
                        <div style={{ ...styles.skeletonLine, width: '40%' }} className="animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Избранное</h1>

            <FavoritesTabs activeTab={activeTab} onChange={setActiveTab} />

            <div style={styles.content}>
                {activeTab === FavoriteType.VENUES ? (
                    <InfiniteScrollList<FavoriteVenue>
                        items={venues}
                        keyExtractor={(v) => v.venueId}
                        renderItem={(v) => <FavoriteVenueCard venue={v} />}
                        hasNextPage={!!hasMoreVenues}
                        isFetchingNextPage={isFetchingMoreVenues}
                        isLoading={isLoading}
                        isError={isError}
                        onLoadMore={fetchNextVenues}
                        emptyState={emptyState}
                        errorState={errorState}
                        skeleton={skeleton}
                        containerStyle={styles.grid}
                        gap={20}
                    />
                ) : (
                    <InfiniteScrollList<FavoriteMenu>
                        items={menus}
                        keyExtractor={(m) => m.menuitemId}
                        renderItem={(m) => <FavoriteMenuCard menuItem={m} />}
                        hasNextPage={!!hasMoreMenus}
                        isFetchingNextPage={isFetchingMoreMenus}
                        isLoading={isLoading}
                        isError={isError}
                        onLoadMore={fetchNextMenus}
                        emptyState={emptyState}
                        errorState={errorState}
                        skeleton={skeleton}
                        containerStyle={styles.grid}
                        gap={20}
                    />
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: '24px',
        textAlign: 'left',
    },
    content: {
        marginTop: '10px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        width: '100%',
    } as React.CSSProperties,
    centerContainer: {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    emptyContainer: {
        marginTop: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 20px',
    },
    heartIconCircle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    emptyTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#1A1A1A',
        margin: '0 0 12px 0',
    },
    emptySubtitle: {
        fontSize: '15px',
        color: '#757575',
        margin: '0 0 32px 0',
        maxWidth: '300px',
        lineHeight: '1.5',
    },
    searchButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '14px 28px',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '700',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
        transition: 'all 0.2s ease',
    },
    errorText: {
        fontSize: '16px',
        color: '#F44336',
        fontWeight: '600',
    },
    retryButton: {
        padding: '12px 32px',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '16px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    skeletonCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    skeletonImage: {
        height: '160px',
        backgroundColor: '#F5F5F5',
    },
    skeletonContent: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    skeletonLine: {
        height: '14px',
        backgroundColor: '#F5F5F5',
        borderRadius: '4px',
    },
};

export default FavoritesScreen;
