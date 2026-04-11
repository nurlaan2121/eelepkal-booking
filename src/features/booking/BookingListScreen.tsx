import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { bookingService } from '../../api/services/bookingService';
import { BookingKind } from '../../api/dto/bookingDto';
import BookingCard from './components/BookingCard';
import BookingTabs from './components/BookingTabs';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';

const BookingListScreen: React.FC = () => {
    const [kind, setKind] = useState<BookingKind>(BookingKind.ACTIVE);
    const LIMIT = 10;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch
    } = useInfiniteQuery({
        queryKey: ['bookings', kind],
        queryFn: ({ pageParam = 0 }) => bookingService.getAllBookings(kind, pageParam, LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === LIMIT ? allPages.length * LIMIT : undefined;
        },
    });

    const bookings = data?.pages.flat() || [];

    if (isLoading) {
        return (
            <div style={styles.centerContainer}>
                <Loader2 size={48} color="#FF9800" className="animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div style={styles.centerContainer}>
                <AlertCircle size={48} color="#F44336" />
                <p style={styles.errorText}>Произошла ошибка при загрузке</p>
                <button style={styles.retryButton} onClick={() => refetch()}>
                    Повторить
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Мои бронирования</h1>

            <BookingTabs activeTab={kind} onChange={setKind} />

            <div style={styles.list}>
                {bookings.length > 0 ? (
                    <>
                        {bookings.map((booking) => (
                            <BookingCard key={booking.bookingId} booking={booking} />
                        ))}

                        {hasNextPage && (
                            <button
                                style={styles.loadMoreButton}
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    'Загрузить еще'
                                )}
                            </button>
                        )}
                    </>
                ) : (
                    <div style={styles.emptyContainer}>
                        <Inbox size={64} color="#BDBDBD" />
                        <p style={styles.emptyText}>У вас нет бронирований</p>
                    </div>
                )}
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
        display: 'flex',
        flexDirection: 'column',
    },
    centerContainer: {
        height: '80vh',
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
    loadMoreButton: {
        margin: '10px 0 40px 0',
        padding: '12px',
        backgroundColor: '#FFFFFF',
        color: '#FF9800',
        border: '2px solid #FF9800',
        borderRadius: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
};

export default BookingListScreen;
