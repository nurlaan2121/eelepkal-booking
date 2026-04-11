import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../../api/services/venueService';
import VenueCard from './components/VenueCard';
import { ChevronRight, Search, Clock, CheckCircle } from 'lucide-react';

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();

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

    const isLoadingCategories = cuisinesQuery.isLoading;

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div style={styles.heroOverlay} />
                <div style={styles.heroContent}>
                    <span style={styles.heroBadge}>Ээлеп кал — №1 в Кыргызстане</span>
                    <h1 style={styles.heroTitle}>Бронируйте столики<br />онлайн за 30 секунд</h1>
                    <p style={styles.heroSubtitle}>Лучшие заведения Бишкека в одном приложении. Выбирайте, бронируйте и наслаждайтесь.</p>
                    <div style={styles.heroActions}>
                        <button className="btn-primary" onClick={() => navigate('/search')}>
                            Забронировать столик
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section style={styles.stepsSection}>
                <h2 style={styles.stepsHeader}>Как это работает</h2>
                <div style={styles.stepsContainer}>
                    <div style={styles.stepCard}>
                        <div style={styles.stepIconWrapper}><Search size={24} color="#FF6B35" /></div>
                        <span style={styles.stepTitle}>Найдите заведение</span>
                        <span style={styles.stepDesc}>Поиск по кухне и рейтингу</span>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepIconWrapper}><Clock size={24} color="#FF6B35" /></div>
                        <span style={styles.stepTitle}>Выберите время</span>
                        <span style={styles.stepDesc}>Удобные слоты бронирования</span>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepIconWrapper}><CheckCircle size={24} color="#FF6B35" /></div>
                        <span style={styles.stepTitle}>Забронируйте</span>
                        <span style={styles.stepDesc}>100% гарантия столика</span>
                    </div>
                </div>
            </section>

            {/* Cuisines Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Категории</h2>
                </div>
                {isLoadingCategories ? (
                    <div style={styles.cuisinesGrid}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="skeleton" style={{ width: '100%', paddingBottom: '100%', borderRadius: 16 }} />
                        ))}
                    </div>
                ) : (
                    <div style={styles.cuisinesGrid}>
                        {cuisinesQuery.data?.slice(0, 8).map((cuisine) => (
                            <div key={cuisine.id} style={styles.cuisineItem} className="card-hover">
                                <div style={styles.cuisineIconWrapper}>
                                    <img src={cuisine.imageUrl} alt={cuisine.name} style={styles.cuisineImage} />
                                </div>
                                <span style={styles.cuisineLabel}>{cuisine.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Recommended Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Рекомендуем</h2>
                    <button style={styles.seeAllBtn} onClick={() => navigate('/search')}>
                        Все <ChevronRight size={16} />
                    </button>
                </div>
                <div style={styles.horizontalScroll} className="hide-scrollbar">
                    {recommendedQuery.isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ minWidth: 260, height: 220, borderRadius: 16 }} />)
                    ) : (
                        recommendedQuery.data?.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))
                    )}
                </div>
            </section>

            {/* Top Rated Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Самые популярные</h2>
                    <button style={styles.seeAllBtn} onClick={() => navigate('/search')}>
                        Все <ChevronRight size={16} />
                    </button>
                </div>
                <div style={styles.horizontalScroll} className="hide-scrollbar">
                    {ratingQuery.isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ minWidth: 260, height: 220, borderRadius: 16 }} />)
                    ) : (
                        ratingQuery.data?.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))
                    )}
                </div>
            </section>

            {/* Open Now Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Сейчас открыты</h2>
                    <button style={styles.seeAllBtn} onClick={() => navigate('/search')}>
                        Все <ChevronRight size={16} />
                    </button>
                </div>
                <div style={styles.horizontalScroll} className="hide-scrollbar">
                    {openQuery.isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ minWidth: 260, height: 220, borderRadius: 16 }} />)
                    ) : (
                        openQuery.data?.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))
                    )}
                </div>
            </section>

            <div style={{ height: 40 }} />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
    },
    heroSection: {
        position: 'relative',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        margin: '16px 20px 0',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        // Mocking the background image URL since it's hardcoded for now, real implementation would fetch it or use the generated path 
        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    heroOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
    },
    heroBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '700',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    heroTitle: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#FFFFFF',
        margin: 0,
        lineHeight: 1.1,
        letterSpacing: '-0.5px',
    },
    heroSubtitle: {
        fontSize: '15px',
        color: 'rgba(255,255,255,0.85)',
        margin: 0,
        lineHeight: 1.5,
    },
    heroActions: {
        marginTop: '8px',
    },
    stepsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '0 20px',
    },
    stepsHeader: {
        fontSize: '18px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: 0,
        letterSpacing: '-0.3px',
    },
    stepsContainer: {
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    stepCard: {
        minWidth: '140px',
        backgroundColor: 'var(--color-surface)',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    stepIconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '4px',
    },
    stepTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: 'var(--color-text)',
    },
    stepDesc: {
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        lineHeight: 1.4,
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    sectionHeader: {
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAllBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        color: 'var(--color-primary)',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        padding: 0,
    },
    cuisinesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '0 20px',
        gap: '16px',
    },
    cuisineItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--color-surface)',
        padding: '12px 8px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
    },
    cuisineIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
    },
    cuisineImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cuisineLabel: {
        fontSize: '12px',
        fontWeight: '700',
        color: 'var(--color-text)',
        textAlign: 'center',
    },
    horizontalScroll: {
        display: 'flex',
        overflowX: 'auto',
        padding: '4px 20px 20px', // Extra top padding for hover shadow clipping
        gap: '16px',
        scrollSnapType: 'x mandatory',
    },
};

export default HomeScreen;
