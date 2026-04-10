import React from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { venueService } from '../../../api/services/venueService';
import { BookingRequest } from '../../../api/dto/venueDto';

interface BookingConfirmationModalProps {
    tableId: number;
    tableTitle: string;
    bookingData: BookingRequest;
    onClose: (success?: boolean) => void;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
    tableId,
    tableTitle,
    bookingData,
    onClose
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [bookingId, setBookingId] = React.useState<number | null>(null);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await venueService.bookTable(tableId, bookingData);
            setBookingId(response.id);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Произошла ошибка при бронировании. Попробуйте еще раз.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date for display
    const displayDate = new Date(bookingData.fullVisitTime.split('T')[0]).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Extract time for display
    const displayTime = bookingData.fullVisitTime.split('T')[1].substring(0, 5);

    if (bookingId) {
        return (
            <div style={styles.overlay} onClick={() => onClose(true)}>
                <div style={styles.modal} onClick={e => e.stopPropagation()}>
                    <div style={styles.successContent}>
                        <div style={styles.successIcon}>
                            <CheckCircle2 size={64} color="#4CAF50" />
                        </div>
                        <h2 style={styles.successTitle}>Успешно!</h2>
                        <p style={styles.successText}>
                            Ваш столик <strong>{tableTitle}</strong> забронирован.
                        </p>
                        <div style={styles.bookingIdBadge}>
                            ID бронирования: #{bookingId}
                        </div>
                        <button style={styles.actionBtn} onClick={() => onClose(true)}>
                            Отлично
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay} onClick={() => !isSubmitting && onClose()}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Проверка данных</h2>
                    <button
                        onClick={() => onClose()}
                        style={styles.closeIcon}
                        disabled={isSubmitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={styles.body}>
                    <p style={styles.subtitle}>Пожалуйста, проверьте данные для бронирования стола <strong>{tableTitle}</strong></p>

                    <div style={styles.infoCard}>
                        <div style={styles.infoRow}>
                            <Calendar size={20} color="#FF9800" />
                            <div style={styles.infoTextContainer}>
                                <span style={styles.infoLabel}>Дата</span>
                                <span style={styles.infoValue}>{displayDate}</span>
                            </div>
                        </div>
                        <div style={styles.infoRow}>
                            <Clock size={20} color="#FF9800" />
                            <div style={styles.infoTextContainer}>
                                <span style={styles.infoLabel}>Время</span>
                                <span style={styles.infoValue}>{displayTime}</span>
                            </div>
                        </div>
                        <div style={styles.infoRow}>
                            <Users size={20} color="#FF9800" />
                            <div style={styles.infoTextContainer}>
                                <span style={styles.infoLabel}>Количество гостей</span>
                                <span style={styles.infoValue}>{bookingData.countOfGuests} чел.</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div style={styles.errorContainer}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div style={styles.footer}>
                        <button
                            style={styles.cancelBtn}
                            onClick={() => onClose()}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            style={styles.confirmBtn}
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} style={styles.spinner} />
                                    Бронирование...
                                </>
                            ) : 'Подтвердить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#FFF',
        width: '90%',
        maxWidth: '400px',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    },
    header: {
        padding: '24px 24px 12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '800',
        margin: 0,
        color: '#212121',
    },
    closeIcon: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        color: '#757575',
    },
    body: {
        padding: '0 24px 24px 24px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#757575',
        marginBottom: '20px',
        lineHeight: '1.4',
    },
    infoCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
    },
    infoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    infoTextContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoLabel: {
        fontSize: '11px',
        color: '#9E9E9E',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: '15px',
        color: '#212121',
        fontWeight: '700',
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        backgroundColor: '#FFEBEE',
        borderRadius: '12px',
        color: '#D32F2F',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '20px',
    },
    footer: {
        display: 'flex',
        gap: '12px',
    },
    cancelBtn: {
        flex: 1,
        padding: '14px',
        borderRadius: '16px',
        border: '1px solid #E0E0E0',
        backgroundColor: '#FFF',
        color: '#757575',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    confirmBtn: {
        flex: 2,
        padding: '14px',
        borderRadius: '16px',
        border: 'none',
        backgroundColor: '#212121',
        color: '#FFF',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    spinner: {
        animation: 'spin 1s linear infinite',
    },
    successContent: {
        padding: '40px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    successIcon: {
        marginBottom: '20px',
    },
    successTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#212121',
        margin: '0 0 12px 0',
    },
    successText: {
        fontSize: '16px',
        color: '#616161',
        marginBottom: '24px',
        lineHeight: '1.5',
    },
    bookingIdBadge: {
        padding: '8px 16px',
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
        borderRadius: '100px',
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '32px',
    },
    actionBtn: {
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        backgroundColor: '#212121',
        color: '#FFF',
        fontSize: '16px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
    },
};

// Add keyframes for spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default BookingConfirmationModal;
