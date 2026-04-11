import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../api/services/bookingService';
import {
    Loader2,
    ChevronLeft,
    MapPin,
    Calendar,
    Users,
    Home,
    Clock,
    Hash,
    CreditCard,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Share2,
    Copy,
    ExternalLink
} from 'lucide-react';
import { formatTimestamp } from '../../shared/utils/dateFormatter';

const BookingDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading, isError, refetch } = useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingService.getBookingById(id!),
        enabled: !!id,
    });

    const handleShare = async () => {
        if (!booking) return;
        const shareData = {
            title: `Бронирование в ${booking.venueName}`,
            text: `Мое бронирование: ${booking.venueName}, ${formatTimestamp(booking.bookingFullVisitTime)}, Код: ${booking.bookingCode}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} \n${shareData.url}`);
                alert('Ссылка скопирована в буфер обмена');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Скопировано!');
    };

    if (isLoading) {
        return (
            <div style={styles.centerContainer}>
                <Loader2 size={48} color="#FF9800" className="animate-spin" />
            </div>
        );
    }

    if (isError || !booking) {
        return (
            <div style={styles.centerContainer}>
                <AlertCircle size={48} color="#F44336" />
                <p style={styles.errorText}>Не удалось загрузить данные бронирования</p>
                <div style={styles.errorActions}>
                    <button style={styles.retryButton} onClick={() => refetch()}>
                        Повторить
                    </button>
                    <button style={styles.backButton} onClick={() => navigate(-1)}>
                        Назад
                    </button>
                </div>
            </div>
        );
    }

    const isPaid = booking.bookingStatus !== 'NOT_PAID';

    return (
        <div style={styles.container}>
            {/* Top Bar */}
            <header style={styles.topBar}>
                <button style={styles.circleBtn} onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1 style={styles.topTitle}>Детали бронирования</h1>
                <button style={styles.circleBtn} onClick={handleShare}>
                    <Share2 size={20} />
                </button>
            </header>

            {/* Status Card */}
            <div style={styles.statusCard(booking.bookingStatus)}>
                <div style={styles.statusHeader}>
                    {isPaid ? <CheckCircle2 size={32} /> : <Clock size={32} />}
                    <div>
                        <p style={styles.statusLabel}>Статус заказа</p>
                        <h2 style={styles.statusValue}>
                            {booking.bookingStatus === 'NOT_PAID' ? 'Ожидает оплаты' : booking.bookingStatus}
                        </h2>
                    </div>
                </div>
                <div style={styles.codeBadge} onClick={() => copyToClipboard(booking.bookingCode.toString())}>
                    <span style={styles.codeLabel}>КОД БРОНИ</span>
                    <div style={styles.codeValueRow}>
                        <span style={styles.codeValue}>{booking.bookingCode}</span>
                        <Copy size={16} />
                    </div>
                </div>
            </div>

            {/* Venue Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <Home size={20} color="#FF9800" />
                    <h3 style={styles.sectionTitle}>Заведение</h3>
                </div>
                <div style={styles.venueContent}>
                    <h4 style={styles.venueName}>{booking.venueName}</h4>
                    <div style={styles.addressRow}>
                        <MapPin size={16} color="#757575" />
                        <span style={styles.addressText}>{booking.address}</span>
                    </div>
                    <button style={styles.viewVenueBtn} onClick={() => navigate(`/venue/${booking.venueId}`)}>
                        Перейти к заведению <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* Details Grid */}
            <div style={styles.detailsGrid}>
                {/* Time Section */}
                <div style={styles.infoBox}>
                    <Calendar size={20} color="#FF9800" />
                    <div>
                        <p style={styles.infoBoxLabel}>Дата и время</p>
                        <p style={styles.infoBoxValue}>{formatTimestamp(booking.bookingFullVisitTime)}</p>
                    </div>
                </div>

                {/* Guests Section */}
                <div style={styles.infoBox}>
                    <Users size={20} color="#4CAF50" />
                    <div>
                        <p style={styles.infoBoxLabel}>Гости</p>
                        <p style={styles.infoBoxValue}>{booking.countOfGuests} чел.</p>
                    </div>
                </div>

                {/* Table Section */}
                <div style={styles.infoBox}>
                    <Home size={20} color="#2196F3" />
                    <div>
                        <p style={styles.infoBoxLabel}>Стол</p>
                        <p style={styles.infoBoxValue}>{booking.tableTitle} ({booking.tableType})</p>
                    </div>
                </div>

                {/* Floor Section */}
                <div style={styles.infoBox}>
                    <Hash size={20} color="#9C27B0" />
                    <div>
                        <p style={styles.infoBoxLabel}>Этаж</p>
                        <p style={styles.infoBoxValue}>{booking.tableInFloor}-й этаж</p>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <CreditCard size={20} color="#F44336" />
                    <h3 style={styles.sectionTitle}>Оплата</h3>
                </div>
                <div style={styles.paymentRow}>
                    <span style={styles.paymentLabel}>Сумма депозита</span>
                    <span style={styles.paymentValue}>{booking.deposit} KGS</span>
                </div>
                <p style={styles.createdDate}>
                    Оформлено: {formatTimestamp(booking.bookingCreatedAt)}
                </p>
            </div>

            {/* ID Badge */}
            <div style={styles.idBadge}>
                ID Бронирования: #{booking.bookingId}
            </div>
        </div>
    );
};

const styles: { [key: string]: any } = {
    container: {
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    topBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '4px',
    },
    circleBtn: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        color: '#1A1A1A',
        transition: 'transform 0.2s ease',
    },
    topTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1A1A1A',
        margin: 0,
    },
    statusCard: (status: string) => ({
        background: status === 'NOT_PAID'
            ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
            : 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
        borderRadius: '24px',
        padding: '24px',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: status === 'NOT_PAID'
            ? '0 10px 25px rgba(255, 152, 0, 0.2)'
            : '0 10px 25px rgba(76, 175, 80, 0.2)',
    }),
    statusHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    statusLabel: {
        fontSize: '13px',
        opacity: 0.9,
        margin: 0,
        fontWeight: '500',
    },
    statusValue: {
        fontSize: '20px',
        fontWeight: '800',
        margin: 0,
    },
    codeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: '12px 16px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
    },
    codeLabel: {
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '1px',
    },
    codeValueRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    codeValue: {
        fontSize: '22px',
        fontWeight: '900',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '16px',
    },
    sectionTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#757575',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    venueContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    venueName: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#1A1A1A',
        margin: 0,
    },
    addressRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    addressText: {
        fontSize: '14px',
        color: '#757575',
    },
    viewVenueBtn: {
        alignSelf: 'flex-start',
        marginTop: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#FF9800',
        fontWeight: '700',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        padding: 0,
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    infoBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    },
    infoBoxLabel: {
        fontSize: '12px',
        color: '#9E9E9E',
        margin: 0,
        fontWeight: '600',
    },
    infoBoxValue: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#1A1A1A',
        margin: 0,
    },
    paymentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    paymentLabel: {
        fontSize: '16px',
        color: '#424242',
        fontWeight: '500',
    },
    paymentValue: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#F44336',
    },
    createdDate: {
        fontSize: '12px',
        color: '#BDBDBD',
        margin: 0,
        textAlign: 'right',
    },
    idBadge: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#BDBDBD',
        fontWeight: '600',
        marginTop: '10px',
    },
    centerContainer: {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    errorText: {
        fontSize: '16px',
        color: '#F44336',
        fontWeight: '600',
        textAlign: 'center',
    },
    errorActions: {
        display: 'flex',
        gap: '12px',
    },
    retryButton: {
        padding: '12px 24px',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    backButton: {
        padding: '12px 24px',
        backgroundColor: '#EEEEEE',
        color: '#424242',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: 'pointer',
    },
};

export default BookingDetailsPage;
