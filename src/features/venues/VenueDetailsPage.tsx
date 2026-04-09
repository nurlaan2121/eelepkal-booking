import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { venueService } from '../../api/services/venueService';
import VenueHeader from './components/VenueHeader';
import VenueInfo from './components/VenueInfo';
import VenueWorkingHours from './components/VenueWorkingHours';
import VenueAmenitiesSection from './components/VenueAmenities';
import VenueContacts from './components/VenueContacts';
import VenueDescription from './components/VenueDescription';
import VenueReviews from './components/VenueReviews';
import VenueFilials from './components/VenueFilials';
import VenuePayments from './components/VenuePayments';

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
    const reviewsQuery = useQuery({ queryKey: ['venueReviews', venueId], queryFn: () => venueService.getVenueReviews(venueId) });
    const filialsQuery = useQuery({ queryKey: ['venueFilials', venueId], queryFn: () => venueService.getVenueFilials(venueId) });
    const paymentsQuery = useQuery({ queryKey: ['venuePayments', venueId], queryFn: () => venueService.getPaymentDetails(venueId) });

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
                    onToggleFavorite={() => { }}
                    onShare={() => { }}
                />

                <VenueInfo
                    basic={basic}
                    details={detailsQuery.data || null}
                />

                <VenueWorkingHours
                    schedule={hoursQuery.data || null}
                    todayHours={basic.todayWorkingHours}
                />

                <VenueDescription description={descriptionQuery.data || null} />

                <VenueAmenitiesSection amenities={amenitiesQuery.data || null} />

                <VenueContacts contacts={contactsQuery.data || null} />

                <VenueReviews reviews={reviewsQuery.data || []} />

                <VenueFilials filials={filialsQuery.data || []} />

                <VenuePayments payments={paymentsQuery.data || []} />
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
};

export default VenueDetailsPage;
