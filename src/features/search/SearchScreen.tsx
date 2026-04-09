import React, { useEffect, useState, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchStore } from './searchStore';
import { venueService } from '../../api/services/venueService';
import VenueCard from '../home/components/VenueCard';
import { Search, Filter, Loader2, SearchX } from 'lucide-react';
import FilterModal from './components/FilterModal';

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
                    <div style={styles.center}>
                        <Loader2 size={40} color="#FF9800" className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div style={styles.center}>
                        <p style={styles.errorText}>Ошибка при поиске. Попробуйте снова.</p>
                    </div>
                ) : results.length > 0 ? (
                    <div style={styles.resultsGrid}>
                        {results.map((venue, index) => (
                            <VenueCard key={`${venue.venueId}-${index}`} venue={venue} />
                        ))}

                        {/* Loading trigger / indicator */}
                        <div ref={observerTarget} style={styles.loaderTarget}>
                            {isFetchingNextPage && (
                                <Loader2 size={24} color="#FF9800" className="animate-spin" />
                            )}
                        </div>
                    </div>
                ) : !isLoading ? (
                    <div style={styles.center}>
                        <SearchX size={64} color="#E0E0E0" />
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

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        padding: '16px 20px',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 10,
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
        padding: '0 20px 20px 20px',
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '32px',
        gap: '16px',
    },
    resultsGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    errorText: {
        color: '#F44336',
        fontSize: '14px',
    },
    emptyText: {
        color: '#757575',
        fontSize: '16px',
        fontWeight: '500',
    },
    loaderTarget: {
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 0',
    },
};


export default SearchScreen;
