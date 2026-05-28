import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { venueService } from '../../api/services/venueService';
import VenueHeader from './components/VenueHeader';
import VenueInfo from './components/VenueInfo';
import VenueWorkingHours from './components/VenueWorkingHours';
import VenueAmenitiesSection from './components/VenueAmenities';
import VenueContacts from './components/VenueContacts';
import VenueDescription from './components/VenueDescription';
import VenueBookingConditions from './components/VenueBookingConditions';
import VenueFilials from './components/VenueFilials';
import VenuePayments from './components/VenuePayments';
import VenueMenuSection from './components/VenueMenuSection';
import VenueTablesSection from './components/VenueTablesSection';
import AddReviewModal from './components/AddReviewModal';
import InfiniteScrollList from '../../components/ui/InfiniteScrollList';
import Skeleton from '../../components/ui/Skeleton';
import SEOManager from '../../shared/components/SEO/SEOManager';
import AuthGuardModal from '../auth/components/AuthGuardModal';
import { useAuthStore } from '../auth/authStore';
import type { VenueReview } from '../../api/dto/venueDto';



const REVIEWS_LIMIT = 10;

const VenueDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const venueId = id || '';

    const [activeTab, setActiveTab] = React.useState<'ABOUT' | 'MENU' | 'BOOKING' | 'REVIEWS'>('ABOUT');
    const [isAddReviewModalOpen, setIsAddReviewModalOpen] = React.useState(false);
    const [isAuthGuardOpen, setIsAuthGuardOpen] = React.useState(false);
    const [guardAction, setGuardAction] = React.useState<'REVIEW' | 'BOOKING' | null>(null);

    const { isAuthenticated } = useAuthStore();

    const handleAddReviewClick = () => {
        if (!isAuthenticated) {
            setGuardAction('REVIEW');
            setIsAuthGuardOpen(true);
        } else {
            setIsAddReviewModalOpen(true);
        }
    };

    const handleStickyBookClick = () => {
        if (!isAuthenticated) {
            setGuardAction('BOOKING');
            setIsAuthGuardOpen(true);
        } else {
            setActiveTab('BOOKING');
            window.scrollTo({ top: 350, behavior: 'smooth' }); // Scroll to tabs
        }
    };

    // Parallel data fetching using multiple useQuery calls
    const basicQuery = useQuery({
        queryKey: ['venueBasic', venueId],
        queryFn: () => venueService.getVenueBasic(venueId),
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    const isAboutTab = activeTab === 'ABOUT';

    const detailsQuery = useQuery({
        queryKey: ['venueDetails', venueId],
        queryFn: () => venueService.getVenueDetails(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 5 * 60 * 1000
    });

    const hoursQuery = useQuery({
        queryKey: ['venueHours', venueId],
        queryFn: () => venueService.getVenueHours(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 10 * 60 * 1000
    });

    const amenitiesQuery = useQuery({
        queryKey: ['venueAmenities', venueId],
        queryFn: () => venueService.getVenueAmenities(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 30 * 60 * 1000
    });

    const contactsQuery = useQuery({
        queryKey: ['venueContacts', venueId],
        queryFn: () => venueService.getVenueContacts(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 30 * 60 * 1000
    });

    const descriptionQuery = useQuery({
        queryKey: ['venueDescription', venueId],
        queryFn: () => venueService.getVenueDescription(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 30 * 60 * 1000
    });

    const filialsQuery = useQuery({
        queryKey: ['venueFilials', venueId],
        queryFn: () => venueService.getVenueFilials(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 30 * 60 * 1000
    });

    const paymentsQuery = useQuery({
        queryKey: ['venuePayments', venueId],
        queryFn: () => venueService.getPaymentDetails(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 30 * 60 * 1000
    });

    const conditionsQuery = useQuery({
        queryKey: ['venueConditions', venueId],
        queryFn: () => venueService.getBookingConditions(venueId),
        enabled: isAboutTab && !!venueId,
        staleTime: 30 * 60 * 1000
    });

    const reviewsQuery = useInfiniteQuery({
        queryKey: ['venueReviews', venueId],
        queryFn: ({ pageParam = 0 }) => venueService.getVenueReviews(venueId, pageParam, REVIEWS_LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === REVIEWS_LIMIT ? allPages.length * REVIEWS_LIMIT : undefined,
        enabled: activeTab === 'REVIEWS' && !!venueId,
    });


    const isLoading = basicQuery.isLoading;
    const error = basicQuery.error;

    if (isLoading) return <VenueSkeleton />;
    if (error || !basicQuery.data) return <div style={styles.error}>Ошибка при загрузке данных</div>;

    const basic = basicQuery.data;

    // Build rich Schema.org JSON-LD for the venue
    const venueSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['Restaurant', 'LocalBusiness'],
                '@id': `https://client.eelepkal.com/venue/${venueId}#venue`,
                name: basic.name,
                description: `${basic.name} — забронируйте столик онлайн через Ээлеп кал. Адрес: ${basic.address}. Средний чек: ${basic.averageCheck} сом.`,
                url: `https://client.eelepkal.com/venue/${venueId}`,
                image: Object.values(basic.images)[0] || 'https://client.eelepkal.com/logo.png',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: basic.address,
                    addressLocality: 'Бишкек',
                    addressCountry: 'KG',
                },
                ...(basic.rating > 0 ? {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: basic.rating.toFixed(1),
                        bestRating: '5',
                        worstRating: '1',
                        ratingCount: '1',
                    }
                } : {}),
                priceRange: basic.averageCheck ? `${basic.averageCheck} сом` : undefined,
                servesCuisine: 'Кыргызская, Восточная',
                currenciesAccepted: 'KGS',
                hasMap: `https://maps.google.com/?q=${encodeURIComponent(basic.address + ', Бишкек')}`,
                openingHours: basic.todayWorkingHours || undefined,
                potentialAction: {
                    '@type': 'ReserveAction',
                    target: `https://client.eelepkal.com/venue/${venueId}`,
                    result: {
                        '@type': 'Reservation',
                        name: `Бронирование столика в ${basic.name}`,
                    },
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://client.eelepkal.com/' },
                    { '@type': 'ListItem', position: 2, name: 'Заведения', item: 'https://client.eelepkal.com/venues' },
                    { '@type': 'ListItem', position: 3, name: basic.name, item: `https://client.eelepkal.com/venue/${venueId}` },
                ],
            },
        ],
    };

    const seoDescription = `${basic.name} — забронируйте столик онлайн через Ээлеп кал. Адрес: ${basic.address}. Средний чек: ${basic.averageCheck} сом. Рейтинг: ${basic.rating.toFixed(1)}. Онлайн бронь без звонков.`;
    const seoKeywords = `${basic.name}, ${basic.name} Бишкек, ${basic.name} онлайн бронь, забронировать столик ${basic.name}, ${basic.name} бронирование, ${basic.name} меню, ${basic.name} отзывы, ресторан Бишкек онлайн бронь`;

    return (
        <div style={styles.page}>
            <SEOManager
                title={`${basic.name} — онлайн бронирование столика`}
                description={seoDescription}
                keywords={seoKeywords}
                ogImage={Object.values(basic.images)[0] || ''}
                canonical={`https://client.eelepkal.com/venue/${venueId}`}
                schema={venueSchema}
            />
            <div style={styles.container}>

                <header style={styles.header}>
                    <button onClick={() => navigate(-1)} style={styles.backButton}>
                        <ChevronLeft size={24} />
                    </button>
                    <span style={styles.headerTitle}>Детали заведения</span>
                </header>

                {/* SEO Breadcrumbs */}
                <nav aria-label="breadcrumb" style={styles.breadcrumb}>
                    <a href="/" style={styles.breadcrumbLink}>Главная</a>
                    <span style={styles.breadcrumbSep}> / </span>
                    <a href="/venues" style={styles.breadcrumbLink}>Заведения</a>
                    <span style={styles.breadcrumbSep}> / </span>
                    <span style={styles.breadcrumbCurrent}>{basic.name}</span>
                </nav>

                <VenueHeader
                    venue={basic}
                    isFavorite={basic.favoriteForClient}
                    onShare={async () => {
                        const shareUrl = window.location.href;
                        const shareData = { title: basic.name, text: `Посмотри заведение ${basic.name} на Ээлеп кал!`, url: shareUrl };
                        if (navigator.share) {
                            try { await navigator.share(shareData); } catch { }
                        } else {
                            await navigator.clipboard.writeText(shareUrl);
                            alert('Ссылка скопирована!');
                        }
                    }}
                />

                <div style={styles.tabs}>
                    <button
                        onClick={() => setActiveTab('ABOUT')}
                        style={{ ...styles.tab, borderBottom: activeTab === 'ABOUT' ? '3px solid #FF9800' : '3px solid transparent', color: activeTab === 'ABOUT' ? '#FF9800' : '#757575' }}
                    >
                        О заведении
                    </button>
                    <button
                        onClick={() => setActiveTab('MENU')}
                        style={{ ...styles.tab, borderBottom: activeTab === 'MENU' ? '3px solid #FF9800' : '3px solid transparent', color: activeTab === 'MENU' ? '#FF9800' : '#757575' }}
                    >
                        Меню
                    </button>
                    <button
                        onClick={() => setActiveTab('BOOKING')}
                        style={{ ...styles.tab, borderBottom: activeTab === 'BOOKING' ? '3px solid #FF9800' : '3px solid transparent', color: activeTab === 'BOOKING' ? '#FF9800' : '#757575' }}
                    >
                        Бронирование
                    </button>
                    <button
                        onClick={() => setActiveTab('REVIEWS')}
                        style={{ ...styles.tab, borderBottom: activeTab === 'REVIEWS' ? '3px solid #FF9800' : '3px solid transparent', color: activeTab === 'REVIEWS' ? '#FF9800' : '#757575' }}
                    >
                        Отзывы
                    </button>
                </div>

                {activeTab === 'ABOUT' && (
                    <>
                        <VenueInfo
                            basic={basic}
                            details={detailsQuery.data || null}
                        />

                        <VenueBookingConditions
                            conditions={conditionsQuery.data || null}
                        />

                        <VenueWorkingHours
                            schedule={hoursQuery.data || null}
                            todayHours={basic.todayWorkingHours}
                        />

                        <VenueDescription description={descriptionQuery.data || null} />

                        <VenueAmenitiesSection 
                            amenities={amenitiesQuery.data || null} 
                            isLoading={amenitiesQuery.isLoading}
                            isError={amenitiesQuery.isError}
                        />

                        <VenueContacts 
                            contacts={contactsQuery.data || null} 
                            isLoading={contactsQuery.isLoading}
                            isError={contactsQuery.isError}
                        />

                        <VenueFilials filials={filialsQuery.data || []} />

                        <VenuePayments payments={paymentsQuery.data || []} />
                    </>
                )}

                {activeTab === 'MENU' && <VenueMenuSection venueId={venueId} />}

                {activeTab === 'BOOKING' && <VenueTablesSection venueId={venueId} />}

                {activeTab === 'REVIEWS' && (
                    <div style={{ marginTop: '16px' }}>
                        <div style={styles.reviewsHeader}>
                            <button onClick={handleAddReviewClick} style={styles.addReviewBtn}>
                                Оставить отзыв
                            </button>
                        </div>
                        <InfiniteScrollList<VenueReview>
                            items={reviewsQuery.data?.pages.flat() ?? []}
                            keyExtractor={(r) => r.id}
                            renderItem={(review) => (
                                <div style={styles.reviewCard}>
                                    <div style={styles.reviewHeader}>
                                        <div style={styles.reviewAvatar}>
                                            {review.client.image ? (
                                                <img src={review.client.image} alt={review.client.fullName} style={styles.reviewAvatarImg} />
                                            ) : (
                                                <span style={styles.reviewAvatarInitial}>
                                                    {review.client.fullName?.charAt(0) ?? '?'}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <div style={styles.reviewAuthor}>{review.client.fullName}</div>
                                            <div style={styles.reviewRating}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} style={{ color: star <= review.rating ? '#FFD700' : '#E0E0E0', fontSize: 14 }}>★</span>
                                                ))}
                                                <span style={styles.reviewDate}>
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={styles.reviewText}>{review.text}</p>
                                </div>
                            )}
                            hasNextPage={!!reviewsQuery.hasNextPage}
                            isFetchingNextPage={reviewsQuery.isFetchingNextPage}
                            isLoading={reviewsQuery.isLoading}
                            isError={reviewsQuery.isError}
                            onLoadMore={reviewsQuery.fetchNextPage}
                            emptyState={<div style={styles.tabEmpty}>Отзывов пока нет</div>}
                            errorState={<div style={styles.tabError}>Ошибка при загрузке отзывов</div>}
                            gap={16}
                        />
                    </div>
                )}

                {isAddReviewModalOpen && (
                    <AddReviewModal
                        venueId={venueId}
                        onClose={() => setIsAddReviewModalOpen(false)}
                        onSuccess={() => {
                            setIsAddReviewModalOpen(false);
                            // Reset and refetch from page 0
                            reviewsQuery.refetch();
                        }}
                    />
                )}

                <AuthGuardModal
                    isOpen={isAuthGuardOpen}
                    onClose={() => {
                        setIsAuthGuardOpen(false);
                        setGuardAction(null);
                    }}
                    message={guardAction === 'BOOKING'
                        ? "Войдите, чтобы забронировать столик в этом заведении."
                        : "Войдите, чтобы оставить отзыв об этом заведении."}
                />
            </div>

            {/* Sticky Mobile Footer CTA */}
            <div style={styles.stickyFooter}>
                <div style={styles.footerInfo}>
                    <div style={styles.footerPrice}>
                        <span style={styles.footerPriceLabel}>Средний чек:</span>
                        <span style={styles.footerPriceValue}>{basic.averageCheck} сом</span>
                    </div>
                </div>
                <button style={styles.stickyBookBtn} onClick={handleStickyBookClick}>
                    Забронировать
                </button>
            </div>
        </div>
    );
};

const VenueSkeleton: React.FC = () => (
    <div style={styles.page}>
        <div style={styles.container}>
            <Skeleton height="300px" borderRadius="24px" style={{ marginBottom: '24px', marginTop: '20px' }} />
            <Skeleton width="60%" height="32px" style={{ marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <Skeleton width="100px" height="40px" borderRadius="20px" />
                <Skeleton width="100px" height="40px" borderRadius="20px" />
                <Skeleton width="100px" height="40px" borderRadius="20px" />
            </div>
            <Skeleton height="100px" borderRadius="24px" style={{ marginBottom: '16px' }} />
            <Skeleton height="80px" borderRadius="24px" style={{ marginBottom: '16px' }} />
            <Skeleton height="120px" borderRadius="24px" style={{ marginBottom: '16px' }} />
        </div>
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        paddingBottom: '40px',
    },
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },
    backButton: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid #E0E0E0',
        backgroundColor: '#FFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    headerTitle: {
        fontSize: '18px',
        fontWeight: '700',
    },
    error: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#F44336',
    },

    tabs: {
        display: 'flex',
        borderBottom: '1px solid #E0E0E0',
        marginBottom: '20px',
        position: 'sticky',
        top: '80px',
        backgroundColor: '#FFF',
        zIndex: 9,
    },
    tab: {
        flex: 1,
        padding: '16px 0',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    tabLoading: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#757575',
    },
    tabError: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#F44336',
    },
    tabEmpty: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#9E9E9E',
    },
    reviewsHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '16px',
    },
    addReviewBtn: {
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    reviewCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #F0F0F0',
    },
    reviewHeader: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '10px',
    },
    reviewAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#FF9800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
    },
    reviewAvatarImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    reviewAvatarInitial: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: '16px',
    },
    reviewAuthor: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#212121',
        marginBottom: '2px',
    },
    reviewRating: {
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
    },
    reviewDate: {
        fontSize: '12px',
        color: '#9E9E9E',
        marginLeft: '6px',
    },
    reviewText: {
        fontSize: '14px',
        color: '#424242',
        lineHeight: '1.5',
        margin: 0,
    },
    stickyFooter: {
        position: 'fixed',
        bottom: '65px',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #E0E0E0',
        zIndex: 100,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
    },
    footerInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    footerPriceLabel: {
        fontSize: '12px',
        color: '#757575',
        fontWeight: '500',
        display: 'block',
    },
    footerPriceValue: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#212121',
    },
    stickyBookBtn: {
        backgroundColor: '#212121',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '16px',
        padding: '16px 32px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '8px 0 4px',
        fontSize: '12px',
    },
    breadcrumbLink: {
        color: '#FF9800',
        textDecoration: 'none',
        fontWeight: '500',
    },
    breadcrumbSep: {
        color: '#BDBDBD',
        margin: '0 4px',
    },
    breadcrumbCurrent: {
        color: '#757575',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '160px',
    },
};

export default VenueDetailsPage;
