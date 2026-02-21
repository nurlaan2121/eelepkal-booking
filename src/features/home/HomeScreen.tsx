import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { venueService } from '../../api/services/venueService';
import VenueCard from './components/VenueCard';
import { Loader2, ChevronRight } from 'lucide-react';

const HomeScreen: React.FC = () => {
    // Fetch all sections in parallel
    const [
        cuisinesQuery,
        recommendedQuery,
        openQuery,
        ratingQuery
    ] = useQueries({
        queries: [
            { queryKey: ['cuisines'], queryFn: () => venueService.getAllCuisines() },
            { queryKey: ['recommended'], queryFn: () => venueService.getRecommendedVenues() },
            { queryKey: ['open'], queryFn: () => venueService.getOpenVenues() },
            { queryKey: ['rating'], queryFn: () => venueService.getTopRatedVenues() },
        ]
    });

    const isLoading = cuisinesQuery.isLoading || recommendedQuery.isLoading;

    if (isLoading) {
        return (
            <div style={styles.loadingContainer}>
                <Loader2 size={48} color="#FF9800" className="animate-spin" />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Cuisines Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Категории</h2>
                </div>
                <div style={styles.cuisinesGrid}>
                    {cuisinesQuery.data?.map((cuisine) => (
                        <div key={cuisine.id} style={styles.cuisineItem}>
                            <div style={styles.cuisineIconWrapper}>
                                <img src={cuisine.imageUrl} alt={cuisine.name} style={styles.cuisineImage} />
                            </div>
                            <span style={styles.cuisineLabel}>{cuisine.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommended Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Рекомендуем</h2>
                    <ChevronRight size={20} color="#757575" />
                </div>
                <div style={styles.horizontalScroll}>
                    {recommendedQuery.data?.map((venue) => (
                        <VenueCard key={venue.venueId} venue={venue} />
                    ))}
                </div>
            </section>

            {/* Open Now Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Сейчас открыты</h2>
                    <ChevronRight size={20} color="#757575" />
                </div>
                <div style={styles.horizontalScroll}>
                    {openQuery.data?.map((venue) => (
                        <VenueCard key={venue.venueId} venue={venue} />
                    ))}
                </div>
            </section>

            {/* Top Rated Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Популярные</h2>
                    <ChevronRight size={20} color="#757575" />
                </div>
                <div style={styles.horizontalScroll}>
                    {ratingQuery.data?.map((venue) => (
                        <VenueCard key={venue.venueId} venue={venue} />
                    ))}
                </div>
            </section>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '10px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    loadingContainer: {
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    sectionHeader: {
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#000000',
        margin: 0,
    },
    cuisinesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '0 20px',
        gap: '12px',
    },
    cuisineItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    cuisineIconWrapper: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    cuisineImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cuisineLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#000000',
    },
    horizontalScroll: {
        display: 'flex',
        overflowX: 'auto',
        padding: '0 20px 10px 20px',
        gap: '16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
};

export default HomeScreen;
