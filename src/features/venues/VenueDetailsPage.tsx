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
import type { VenueReview } from '../../api/dto/venueDto';

const REVIEWS_LIMIT = 10;

const VenueDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const venueId = id || '';

    // Parallel data fetching using multiple useQuery calls
    const basicQuery = useQuery({ queryKey: ['venueBasic', venueId], queryFn: () => venueService.getVenueBasic(venueId) });
    const detailsQuery = useQuery({ queryKey: ['venueDetails', venueId], queryFn: () => venueService.getVenueDetails(venueId) });
    const hoursQuery = useQuery({ queryKey: ['venueHours', venueId], queryFn: () => venueService.getVenueHours(venueId) });
    const amenitiesQuery = useQuery({ queryKey: ['venueAmenities', venueId], queryFn: () => venueService.getVenueAmenities(venueId) });
    const contactsQuery = useQuery({ queryKey: ['venueContacts', venueId], queryFn: () => venueService.getVenueContacts(venueId) });
    const descriptionQuery = useQuery({ queryKey: ['venueDescription', venueId], queryFn: () => venueService.getVenueDescription(venueId) });
    const reviewsQuery = useInfiniteQuery({
        queryKey: ['venueReviews', venueId],
        queryFn: ({ pageParam = 0 }) => venueService.getVenueReviews(venueId, pageParam, REVIEWS_LIMIT),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === REVIEWS_LIMIT ? allPages.length * REVIEWS_LIMIT : undefined,
    });
    const filialsQuery = useQuery({ queryKey: ['venueFilials', venueId], queryFn: () => venueService.getVenueFilials(venueId) });
    const paymentsQuery = useQuery({ queryKey: ['venuePayments', venueId], queryFn: () => venueService.getPaymentDetails(venueId) });
    const conditionsQuery = useQuery({ queryKey: ['venueConditions', venueId], queryFn: () => venueService.getBookingConditions(venueId) });

    const [activeTab, setActiveTab] = React.useState<'ABOUT' | 'MENU' | 'BOOKING' | 'REVIEWS'>('ABOUT');
    const [isAddReviewModalOpen, setIsAddReviewModalOpen] = React.useState(false);

    const isLoading = basicQuery.isLoading;
    const error = basicQuery.error;

    if (isLoading) return <VenueSkeleton />;
    if (error || !basicQuery.data) return <div style={styles.error}>Ошибка при загрузке данных</div>;

    const basic = basicQuery.data;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <header style={styles.header}>
                    <button onClick={() => navigate(-1)} style={styles.backButton}>
                        <ChevronLeft size={24} />
                    </button>
                    <span style={styles.headerTitle}>Детали заведения</span>
                </header>

                <VenueHeader
                    venue={basic}
                    isFavorite={basic.favoriteForClient}
                    onShare={() => { }}
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

                        <VenueAmenitiesSection amenities={amenitiesQuery.data || null} />

                        <VenueContacts contacts={contactsQuery.data || null} />

                        <VenueFilials filials={filialsQuery.data || []} />

                        <VenuePayments payments={paymentsQuery.data || []} />
                    </>
                )}

                {activeTab === 'MENU' && <VenueMenuSection venueId={venueId} />}

                {activeTab === 'BOOKING' && <VenueTablesSection venueId={venueId} />}

                {activeTab === 'REVIEWS' && (
                    <div style={{ marginTop: '16px' }}>
                        <div style={styles.reviewsHeader}>
                            <button onClick={() => setIsAddReviewModalOpen(true)} style={styles.addReviewBtn}>
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
            </div>
        </div>
    );
};

const VenueSkeleton: React.FC = () => (
    <div style={styles.page}>
        <div style={styles.container}>
            <div style={{ ...styles.skeleton, height: '300px', marginBottom: '24px' }} />
            <div style={{ ...styles.skeleton, height: '24px', width: '60%', marginBottom: '16px' }} />
            <div style={{ ...styles.skeleton, height: '100px', marginBottom: '16px' }} />
            <div style={{ ...styles.skeleton, height: '80px', marginBottom: '16px' }} />
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
    skeleton: {
        backgroundColor: '#F5F5F5',
        borderRadius: '16px',
        animation: 'pulse 1.5s infinite ease-in-out',
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
};

export default VenueDetailsPage;
