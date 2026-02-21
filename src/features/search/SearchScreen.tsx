import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from './searchStore';
import { venueService } from '../../api/services/venueService';
import VenueCard from '../home/components/VenueCard';
import { Search, Filter, Loader2, SearchX } from 'lucide-react';
import FilterModal from './components/FilterModal';

const SearchScreen: React.FC = () => {
    const { query, filters, setQuery } = useSearchStore();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    const { data: results, isLoading, isError } = useQuery({
        queryKey: ['searchVenues', debouncedQuery, filters],
        queryFn: () => venueService.searchVenues(debouncedQuery, filters),
        enabled: true, // Fetch even if query is empty to show default/filtered venues
    });

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
                {isLoading ? (
                    <div style={styles.center}>
                        <Loader2 size={40} color="#FF9800" className="animate-spin" />
                    </div>
                ) : isError ? (
                    <div style={styles.center}>
                        <p style={styles.errorText}>Ошибка при поиске. Попробуйте снова.</p>
                    </div>
                ) : results && results.length > 0 ? (
                    <div style={styles.resultsGrid}>
                        {results.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))}
                    </div>
                ) : (
                    <div style={styles.center}>
                        <SearchX size={64} color="#E0E0E0" />
                        <p style={styles.emptyText}>Ничего не найдено</p>
                    </div>
                )}
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
};

export default SearchScreen;
