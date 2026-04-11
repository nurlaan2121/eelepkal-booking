import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { bookingService } from '../../api/services/bookingService';
import { BookingKind } from '../../api/dto/bookingDto';
import BookingCard from './components/BookingCard';
import BookingTabs from './components/BookingTabs';
import InfiniteScrollList from '../../components/ui/InfiniteScrollList';
import type { BookingDTO } from '../../api/dto/bookingDto';
import { Inbox, AlertCircle } from 'lucide-react';

const LIMIT = 10;

const BookingListScreen: React.FC = () => {
    const [kind, setKind] = useState<BookingKind>(BookingKind.ACTIVE);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['bookings', kind],
        queryFn: ({ pageParam = 0 }) => bookingService.getAllBookings(kind, pageParam, LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === LIMIT ? allPages.length * LIMIT : undefined,
    });

    const bookings: BookingDTO[] = data?.pages.flat() ?? [];

    const emptyState = (
        <div style={styles.emptyContainer}>
            <Inbox size={64} color="#BDBDBD" />
            <p style={styles.emptyText}>У вас нет бронирований</p>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((i) => (
                <div key={i} style={styles.skeletonCard} className="animate-pulse" />
            ))}
        </div>
    );

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Мои бронирования</h1>

            <BookingTabs
                activeTab={kind}
                onChange={(newKind) => {
                    // Switching tabs triggers a new queryKey → React Query auto-resets
                    setKind(newKind);
                }}
            />

            <div style={styles.list}>
                <InfiniteScrollList<BookingDTO>
                    items={bookings}
                    keyExtractor={(b) => b.bookingId}
                    renderItem={(b) => <BookingCard booking={b} />}
                    hasNextPage={!!hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    isError={isError}
                    onLoadMore={fetchNextPage}
                    emptyState={emptyState}
                    errorState={errorState}
                    skeleton={skeleton}
                    gap={12}
                />
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: '100vh',
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: '24px',
        textAlign: 'center',
    },
    list: {
        marginTop: '8px',
    },
    centerContainer: {
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    emptyContainer: {
        marginTop: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    emptyText: {
        fontSize: '16px',
        color: '#757575',
        fontWeight: '500',
    },
    errorText: {
        fontSize: '16px',
        color: '#F44336',
        fontWeight: '600',
    },
    retryButton: {
        padding: '10px 24px',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    skeletonCard: {
        height: '120px',
        borderRadius: '16px',
        backgroundColor: '#F0F0F0',
    },
};

export default BookingListScreen;
