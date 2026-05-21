import React, { useEffect, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchStore } from './searchStore';
import { venueService } from '../../api/services/venueService';
import VenueCard from '../home/components/VenueCard';
import { Search, Filter, SearchX } from 'lucide-react';
import FilterModal from './components/FilterModal';
import Skeleton from '../../components/ui/Skeleton';

const SearchScreen: React.FC = () => {
    const { query, filters, setQuery } = useSearchStore();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['searchVenues', debouncedQuery, filters],
        queryFn: ({ pageParam = 0 }) => venueService.searchVenues(debouncedQuery, filters, pageParam, 20),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            // If the last page has 20 items, there might be more
            return lastPage.length === 20 ? allPages.length * 20 : undefined;
        },
    });

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const results = data?.pages.flat() || [];

    return (
        <div style={styles.container}>
            {/* Search Bar */}
            <div style={styles.header}>
                <div style={styles.searchWrapper}>
                    <Search size={20} color="#757575" style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Найти заведение..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={styles.input}
                    />
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        style={styles.filterButton}
                    >
                        <Filter size={20} color={Object.values(filters).some(v => v !== undefined) ? '#FF9800' : '#757575'} />
                    </button>
                </div>
            </div>

            {/* Results */}
            <div style={styles.content}>
                {isLoading && !isFetchingNextPage ? (
                    <div className="responsive-grid">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <VenueCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <div style={styles.center}>
                        <p style={styles.errorText}>Ошибка при поиске. Попробуйте снова.</p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="responsive-grid">
                            {results.map((venue, index) => (
                                <VenueCard key={`${venue.venueId}-${index}`} venue={venue} />
                            ))}
                        </div>

                        {/* Loading trigger / indicator */}
                        <div ref={observerTarget} style={styles.loaderTarget}>
                            {isFetchingNextPage && (
                                <div className="responsive-grid" style={{ width: '100%', marginTop: '16px' }}>
                                    {[1, 2, 3].map((i) => (
                                        <VenueCardSkeleton key={i} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : !isLoading ? (
                    <div style={styles.center}>
                        <SearchX size={64} color="var(--color-text-muted)" />
                        <p style={styles.emptyText}>Ничего не найдено</p>
                    </div>
                ) : null}
            </div>


            {/* Filter Modal */}
            {isFilterOpen && (
                <FilterModal onClose={() => setIsFilterOpen(false)} />
            )}
        </div>
    );
};

const VenueCardSkeleton: React.FC = () => (
    <div style={styles.cardSkeleton}>
        <Skeleton height="150px" borderRadius="var(--radius-xl) var(--radius-xl) 0 0" />
        <div style={{ padding: '16px' }}>
            <Skeleton width="80%" height="20px" style={{ marginBottom: '8px' }} />
            <Skeleton width="40%" height="14px" style={{ marginBottom: '12px' }} />
            <Skeleton width="60%" height="14px" />
        </div>
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg)',
    },
    header: {
        padding: '16px 20px',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    searchWrapper: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        padding: '0 12px',
        height: '48px',
    },
    searchIcon: {
        marginRight: '8px',
    },
    input: {
        flex: 1,
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '16px',
        outline: 'none',
        color: '#000000',
    },
    filterButton: {
        border: 'none',
        backgroundColor: 'transparent',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        padding: '20px',
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '64px',
        gap: '16px',
    },
    cardSkeleton: {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
    },
    resultsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    errorText: {
        color: 'var(--color-error)',
        fontSize: '14px',
    },
    emptyText: {
        color: 'var(--color-text-muted)',
        fontSize: '16px',
        fontWeight: '500',
    },
    loaderTarget: {
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
};


export default SearchScreen;
