import React from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, AlertCircle, Loader2, Landmark, QrCode, Upload, Image as ImageIcon } from 'lucide-react';
import { venueService } from '../../../api/services/venueService';
import { BookingRequest, VenuePaymentDetails } from '../../../api/dto/venueDto';

interface BookingConfirmationModalProps {
    tableId: number;
    tableTitle: string;
    bookingData: BookingRequest;
    onClose: (success?: boolean) => void;
}

type ModalStage = 'CONFIRM' | 'PAYMENT' | 'SUCCESS';

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
    tableId,
    tableTitle,
    bookingData,
    onClose
}) => {
    const [stage, setStage] = React.useState<ModalStage>('CONFIRM');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [bookingId, setBookingId] = React.useState<number | null>(null);
    const [paymentDetails, setPaymentDetails] = React.useState<VenuePaymentDetails[]>([]);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadSuccess, setUploadSuccess] = React.useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            // 1. Create booking
            const response = await venueService.bookTable(tableId, bookingData);
            const newBookingId = response.id;
            setBookingId(newBookingId);

            // 2. Check for payment details
            const payments = await venueService.getPaymentDetails(bookingData.venueId);
            setPaymentDetails(payments);

            // 3. Determine if payment is required
            // Array not empty AND at least one qrcodeUrl != null
            const requiresPayment = payments.length > 0 && payments.some(p => p.qrcodeUrl !== null);

            if (requiresPayment) {
                setStage('PAYMENT');
            } else {
                setStage('SUCCESS');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Произошла ошибка при бронировании. Попробуйте еще раз.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUploadAndBind = async () => {
        if (!selectedFile || !bookingId) return;

        setIsUploading(true);
        setError(null);
        try {
            // 1. Upload to S3
            const uploadRes = await venueService.uploadReceipt(selectedFile);
            const fileUrl = uploadRes.data;

            // 2. Bind to booking
            await venueService.assignReceiptToBooking(bookingId, fileUrl);

            setUploadSuccess(true);
            setTimeout(() => {
                setStage('SUCCESS');
            }, 1500);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка при загрузке чека. Попробуйте еще раз.';
            setError(message);
        } finally {
            setIsUploading(false);
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

    // Initial Confirmation Stage
    if (stage === 'CONFIRM') {
        return (
            <div style={styles.overlay} onClick={() => !isSubmitting && onClose()}>
                <div style={styles.modal} onClick={e => e.stopPropagation()}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Проверка данных</h2>
                        <button onClick={() => onClose()} style={styles.closeIcon} disabled={isSubmitting}>
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
                            <button style={styles.cancelBtn} onClick={() => onClose()} disabled={isSubmitting}>
                                Отмена
                            </button>
                            <button style={styles.confirmBtn} onClick={handleConfirm} disabled={isSubmitting}>
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
    }

    // Payment Stage
    if (stage === 'PAYMENT') {
        const payment = paymentDetails.find(p => p.qrcodeUrl !== null) || paymentDetails[0];

        return (
            <div style={styles.overlay} onClick={() => !isUploading && onClose()}>
                <div style={styles.modal} onClick={e => e.stopPropagation()}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>Предоплата</h2>
                        {!isUploading && (
                            <button onClick={() => setStage('SUCCESS')} style={styles.closeIcon}>
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    <div style={styles.body}>
                        <p style={styles.subtitle}>Для подтверждения бронирования необходимо внести предоплату по реквизитам ниже:</p>

                        <div style={styles.paymentCard}>
                            {payment.qrcodeUrl && (
                                <div style={styles.qrContainer}>
                                    <img src={payment.qrcodeUrl} alt="QR Code" style={styles.qrImage} />
                                    <div style={styles.qrLabel}>
                                        <QrCode size={14} />
                                        Отсканируйте для оплаты
                                    </div>
                                </div>
                            )}

                            <div style={styles.bankDetails}>
                                <div style={styles.bankRow}>
                                    <Landmark size={18} color="#757575" />
                                    <div style={styles.bankInfo}>
                                        <span style={styles.infoLabel}>Банк</span>
                                        <span style={styles.bankValue}>{payment.bankName || 'Банковский перевод'}</span>
                                    </div>
                                </div>
                                <div style={styles.bankRow}>
                                    <div style={{ ...styles.bankInfo, marginLeft: '34px' }}>
                                        <span style={styles.infoLabel}>Номер счета</span>
                                        <span style={styles.bankValue}>{payment.bankAccountNumber}</span>
                                    </div>
                                </div>
                                {payment.taxIdentificationNumber && (
                                    <div style={styles.bankRow}>
                                        <div style={{ ...styles.bankInfo, marginLeft: '34px' }}>
                                            <span style={styles.infoLabel}>ИНН</span>
                                            <span style={styles.bankValue}>{payment.taxIdentificationNumber}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={styles.uploadSection}>
                            <label style={styles.uploadLabel}>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                    disabled={isUploading || uploadSuccess}
                                />
                                <div style={{
                                    ...styles.uploadBox,
                                    borderColor: selectedFile ? '#4CAF50' : '#E0E0E0',
                                    backgroundColor: selectedFile ? '#F1F8E9' : '#FAFAFA'
                                }}>
                                    {selectedFile ? (
                                        <>
                                            <ImageIcon size={24} color="#4CAF50" />
                                            <span style={{ ...styles.uploadText, color: '#2E7D32' }}>{selectedFile.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} color="#9E9E9E" />
                                            <span style={styles.uploadText}>Выберите файл чека</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        {error && (
                            <div style={styles.errorContainer}>
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            style={{
                                ...styles.actionBtn,
                                opacity: !selectedFile || isUploading ? 0.7 : 1,
                                backgroundColor: uploadSuccess ? '#4CAF50' : '#212121'
                            }}
                            onClick={handleUploadAndBind}
                            disabled={!selectedFile || isUploading || uploadSuccess}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={18} style={styles.spinner} />
                                    Загрузка...
                                </>
                            ) : uploadSuccess ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    Чек отправлен!
                                </>
                            ) : 'Отправить чек'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success Stage
    const isPaymentFlow = paymentDetails.length > 0 && paymentDetails.some(p => p.qrcodeUrl !== null);

    return (
        <div style={styles.overlay} onClick={() => onClose(true)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.successContent}>
                    <div style={styles.successIcon}>
                        <CheckCircle2 size={64} color="#4CAF50" />
                    </div>
                    <h2 style={styles.successTitle}>Успешно!</h2>
                    <p style={styles.successText}>
                        {isPaymentFlow
                            ? 'Чек успешно отправлен. Администратор проверит оплату и подтвердит бронирование.'
                            : 'Запрос отправлен. Пожалуйста, подождите, пока администратор подтвердит бронирование.'
                        }
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
        backdropFilter: 'blur(8px)',
    },
    modal: {
        backgroundColor: '#FFF',
        width: '94%',
        maxWidth: '420px',
        borderRadius: '32px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    },
    header: {
        padding: '24px 24px 8px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '22px',
        fontWeight: '800',
        margin: 0,
        color: '#121212',
        letterSpacing: '-0.5px',
    },
    closeIcon: {
        background: '#F5F5F5',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '12px',
        color: '#757575',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        padding: '0 24px 24px 24px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
        lineHeight: '1.5',
    },
    infoCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: '20px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
        border: '1px solid #F3F4F6',
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
        color: '#9CA3AF',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '2px',
    },
    infoValue: {
        fontSize: '15px',
        color: '#111827',
        fontWeight: '700',
    },
    paymentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '20px',
        marginBottom: '24px',
        border: '1.5px dashed #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    qrContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    qrImage: {
        width: '180px',
        height: '180px',
        borderRadius: '16px',
        border: '1px solid #F3F4F6',
        padding: '10px',
    },
    qrLabel: {
        fontSize: '12px',
        color: '#6B7280',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    bankDetails: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    bankRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    bankInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    bankValue: {
        fontSize: '14px',
        color: '#111827',
        fontWeight: '700',
        wordBreak: 'break-all',
    },
    uploadSection: {
        marginBottom: '24px',
    },
    uploadLabel: {
        cursor: 'pointer',
    },
    uploadBox: {
        height: '64px',
        border: '2px dashed #E0E0E0',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.2s ease',
    },
    uploadText: {
        fontSize: '14px',
        color: '#757575',
        fontWeight: '600',
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 16px',
        backgroundColor: '#FEF2F2',
        borderRadius: '14px',
        color: '#DC2626',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '20px',
        border: '1px solid #FEE2E2',
    },
    footer: {
        display: 'flex',
        gap: '12px',
    },
    cancelBtn: {
        flex: 1,
        padding: '16px',
        borderRadius: '18px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFF',
        color: '#6B7280',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    confirmBtn: {
        flex: 2,
        padding: '16px',
        borderRadius: '18px',
        border: 'none',
        backgroundColor: '#121212',
        color: '#FFF',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    },
    spinner: {
        animation: 'spin 1s linear infinite',
    },
    successContent: {
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    successIcon: {
        width: '96px',
        height: '96px',
        backgroundColor: '#F0FDF4',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    successTitle: {
        fontSize: '26px',
        fontWeight: '900',
        color: '#111827',
        margin: '0 0 12px 0',
        letterSpacing: '-1px',
    },
    successText: {
        fontSize: '16px',
        color: '#4B5563',
        marginBottom: '32px',
        lineHeight: '1.6',
    },
    bookingIdBadge: {
        padding: '10px 20px',
        backgroundColor: '#F3F4F6',
        color: '#374151',
        borderRadius: '100px',
        fontSize: '14px',
        fontWeight: '800',
        marginBottom: '40px',
        border: '1px solid #E5E7EB',
    },
    actionBtn: {
        width: '100%',
        padding: '18px',
        borderRadius: '18px',
        backgroundColor: '#121212',
        color: '#FFF',
        fontSize: '16px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.3s ease',
    },
};

// Add keyframes for spinner
if (typeof document !== 'undefined') {
    const styleId = 'booking-modal-styles';
    if (!document.getElementById(styleId)) {
        const styleSheet = document.createElement("style");
        styleSheet.id = styleId;
        styleSheet.innerText = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

export default BookingConfirmationModal;
