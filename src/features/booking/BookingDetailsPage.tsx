import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../api/services/bookingService';
import { Loader2, ChevronLeft, MapPin, Calendar, Users, Home, Clock, Hash, CreditCard, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatTimestamp } from '../../shared/utils/dateFormatter';

const BookingDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading, isError, refetch } = useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingService.getBookingById(id!),
        enabled: !!id,
    });

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
                <button style={styles.retryButton} onClick={() => refetch()}>
                    Повторить
                </button>
                <button style={styles.backButton} onClick={() => navigate(-1)}>
                    Назад
                </button>
            </div>
        );
    }

    const isPaid = booking.bookingStatus !== 'NOT_PAID';

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button style={styles.iconButton} onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="#000" />
                </button>
                <h1 style={styles.title}>Детали бронирования</h1>
                <div style={{ width: 24 }} /> {/* Spacer */}
            </header>

            <div style={styles.card}>
                <div style={styles.statusSection(booking.bookingStatus)}>
                    {isPaid ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    <span style={styles.statusText}>
                        {booking.bookingStatus === 'NOT_PAID' ? 'Ожидает оплаты' : booking.bookingStatus}
                    </span>
                </div>

                <div style={styles.content}>
                    <h2 style={styles.venueName}>{booking.venueName}</h2>
                    <p style={styles.address}>
                        <MapPin size={16} color="#757575" />
                        {booking.address}
                    </p>

                    <hr style={styles.divider} />

                    <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                            <Calendar size={20} color="#FF9800" />
                            <div style={styles.infoTextWrapper}>
                                <span style={styles.infoLabel}>Дата и время</span>
                                <span style={styles.infoValue}>{formatTimestamp(booking.bookingFullVisitTime)}</span>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <Users size={20} color="#4CAF50" />
                            <div style={styles.infoTextWrapper}>
                                <span style={styles.infoLabel}>Гости</span>
                                <span style={styles.infoValue}>{booking.countOfGuests} чел.</span>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <Home size={20} color="#2196F3" />
                            <div style={styles.infoTextWrapper}>
                                <span style={styles.infoLabel}>Стол</span>
                                <span style={styles.infoValue}>{booking.tableTitle} ({booking.tableType})</span>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <Hash size={20} color="#9C27B0" />
                            <div style={styles.infoTextWrapper}>
                                <span style={styles.infoLabel}>Код брони</span>
                                <span style={styles.infoValue}>{booking.bookingCode}</span>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <CreditCard size={20} color="#F44336" />
                            <div style={styles.infoTextWrapper}>
                                <span style={styles.infoLabel}>Депозит</span>
                                <span style={styles.infoValue}>{booking.deposit} KGS</span>
                            </div>
                        </div>

                        <div style={styles.infoItem}>
                            <Clock size={20} color="#607D8B" />
                            <div style={styles.infoTextWrapper}>
                                <span style={styles.infoLabel}>Создано</span>
                                <span style={styles.infoValue}>{formatTimestamp(booking.bookingCreatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.footer}>
                <p style={styles.footerNote}>
                    Этаж: {booking.tableInFloor} • ID: {booking.bookingId}
                </p>
            </div>
        </div>
    );
};

const styles: { [key: string]: any } = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#000',
        margin: 0,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
    },
    statusSection: (status: string) => ({
        backgroundColor: status === 'NOT_PAID' ? '#FFF3E0' : '#E8F5E9',
        color: status === 'NOT_PAID' ? '#EF6C00' : '#2E7D32',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
    }),
    statusText: {
        fontSize: '18px',
        fontWeight: '700',
    },
    content: {
        padding: '24px',
    },
    venueName: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: '8px',
        textAlign: 'center',
    },
    address: {
        fontSize: '14px',
        color: '#757575',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        marginBottom: '20px',
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #EEEEEE',
        margin: '20px 0',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    infoTextWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    infoLabel: {
        fontSize: '12px',
        color: '#9E9E9E',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: '14px',
        color: '#212121',
        fontWeight: '700',
    },
    footer: {
        marginTop: '32px',
        textAlign: 'center',
    },
    footerNote: {
        fontSize: '12px',
        color: '#BDBDBD',
        fontWeight: '500',
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
    },
    retryButton: {
        padding: '10px 24px',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    backButton: {
        padding: '10px 24px',
        backgroundColor: 'transparent',
        color: '#757575',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default BookingDetailsPage;
