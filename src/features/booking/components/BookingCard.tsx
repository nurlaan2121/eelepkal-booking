import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, Home, Clock } from 'lucide-react';
import { BookingDTO } from '../../../api/dto/bookingDto';
import { formatTimestamp } from '../../../shared/utils/dateFormatter';

interface BookingCardProps {
    booking: BookingDTO;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const navigate = useNavigate();

    return (
        <div style={styles.card} onClick={() => navigate(`/booking/${booking.bookingId}`)}>
            <div style={styles.imageContainer}>
                <img src={booking.firstImageUrl} alt={booking.venueName} style={styles.image} />
                <div style={styles.statusBadge(booking.bookingStatus)}>
                    {booking.bookingStatus}
                </div>
                <div style={styles.ratingBadge}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <span style={styles.ratingText}>{booking.rating.toFixed(1)}</span>
                </div>
            </div>

            <div style={styles.info}>
                <div style={styles.header}>
                    <h3 style={styles.venueName}>{booking.venueName}</h3>
                    <span style={styles.cuisine}>{booking.cuisine}</span>
                </div>

                <div style={styles.detailsList}>
                    <div style={styles.detailItem}>
                        <MapPin size={16} color="#757575" />
                        <span style={styles.detailText}>{booking.address}</span>
                    </div>

                    <div style={styles.detailItem}>
                        <Calendar size={16} color="#FF9800" />
                        <span style={styles.detailText}>
                            {formatTimestamp(booking.bookingFullVisitTime)}
                        </span>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.detailItem}>
                            <Users size={16} color="#4CAF50" />
                            <span style={styles.detailText}>{booking.countOfGuests} гостей</span>
                        </div>
                        <div style={styles.detailItem}>
                            <Home size={16} color="#2196F3" />
                            <span style={styles.detailText}>{booking.etableType}</span>
                        </div>
                    </div>

                    <div style={styles.detailItem}>
                        <Clock size={16} color="#9C27B0" />
                        <span style={styles.detailText}>Забронировано: {formatTimestamp(booking.bookingCreatedAd)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: any } = {
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
    },
    imageContainer: {
        position: 'relative',
        height: '180px',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    statusBadge: (status: string) => ({
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: status === 'ACTIVE' ? '#4CAF50' : 'rgba(0, 0, 0, 0.6)',
        color: '#FFFFFF',
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        backdropFilter: 'blur(4px)',
    }),
    ratingBadge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 10px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backdropFilter: 'blur(4px)',
    },
    ratingText: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#000000',
    },
    info: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    venueName: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#1A1A1A',
        margin: 0,
        flex: 1,
    },
    cuisine: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#FF9800',
        backgroundColor: '#FFF3E0',
        padding: '4px 8px',
        borderRadius: '8px',
        marginLeft: '8px',
    },
    detailsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    detailItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    detailText: {
        fontSize: '14px',
        color: '#424242',
        fontWeight: '500',
    },
    row: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
    },
};

export default BookingCard;
