import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { venueService } from '../../../api/services/venueService';
import type { ReviewRequest } from '../../../api/dto/venueDto';

interface AddReviewModalProps {
    venueId: string | number;
    onClose: () => void;
    onSuccess: () => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ venueId, onClose, onSuccess }) => {
    const [rating, setRating] = useState<number>(0);
    const [text, setText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Пожалуйста, выберите оценку.');
            return;
        }
        if (!text.trim()) {
            setError('Пожалуйста, напишите отзыв.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const data: ReviewRequest = { rating, text: text.trim() };
            await venueService.addVenueReview(venueId, data);
            onSuccess();
        } catch (err: any) {
            console.error('Failed to submit review:', err);
            setError(err?.response?.data?.message || 'Не удалось отправить отзыв. Попробуйте еще раз.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Оставить отзыв</h2>
                    <button onClick={onClose} style={styles.closeBtn} disabled={isSubmitting}>
                        <X size={24} color="#000" />
                    </button>
                </div>

                <div style={styles.body}>
                    {error && <div style={styles.errorText}>{error}</div>}

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Ваша оценка</h3>
                        <div style={styles.ratingRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={styles.starBtn}
                                    type="button"
                                >
                                    <Star
                                        size={32}
                                        color={star <= rating ? "#FFD700" : "#E0E0E0"}
                                        fill={star <= rating ? "#FFD700" : "transparent"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Комментарий</h3>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Поделитесь своими впечатлениями о заведении..."
                            style={styles.textArea}
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div style={styles.footer}>
                    <button
                        onClick={handleSubmit}
                        style={{ ...styles.submitBtn, opacity: (!rating || !text.trim() || isSubmitting) ? 0.6 : 1 }}
                        disabled={!rating || !text.trim() || isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={24} className="animate-spin" color="#FFF" /> : 'Отправить'}
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
    },
    modal: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        animation: 'fadeIn 0.2s ease-out',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
        color: '#000',
    },
    closeBtn: {
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: '4px',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    errorText: {
        color: '#F44336',
        fontSize: '14px',
        padding: '12px',
        backgroundColor: '#FFEBEE',
        borderRadius: '8px',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#757575',
        margin: 0,
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    starBtn: {
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        transition: 'transform 0.1s',
    },
    textArea: {
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        padding: '16px',
        fontSize: '15px',
        outline: 'none',
        resize: 'none',
        fontFamily: 'inherit',
    },
    footer: {
        display: 'flex',
        marginTop: '8px',
    },
    submitBtn: {
        flex: 1,
        height: '52px',
        borderRadius: '15px',
        border: 'none',
        backgroundColor: '#FF9800',
        fontSize: '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default AddReviewModal;
