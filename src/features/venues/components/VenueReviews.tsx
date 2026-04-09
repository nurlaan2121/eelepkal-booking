import React from 'react';
import { Star, User } from 'lucide-react';
import type { VenueReview } from '../../../api/dto/venueDto';

interface VenueReviewsProps {
    reviews: VenueReview[];
}

const VenueReviews: React.FC<VenueReviewsProps> = ({ reviews }) => {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Отзывы ({reviews.length})</h2>
            <div style={styles.list}>
                {reviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.header}>
                            <div style={styles.avatar}>
                                {review.client.image ? (
                                    <img src={review.client.image} alt={review.client.fullName} style={styles.avatarImg} />
                                ) : (
                                    <User size={20} color="#757575" />
                                )}
                            </div>
                            <div style={styles.meta}>
                                <span style={styles.author}>{review.client.fullName}</span>
                                <div style={styles.ratingRow}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={12}
                                            color={star <= review.rating ? "#FFD700" : "#E0E0E0"}
                                            fill={star <= review.rating ? "#FFD700" : "transparent"}
                                        />
                                    ))}
                                    <span style={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <p style={styles.text}>{review.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        marginBottom: '24px',
        border: '1px solid #F0F0F0',
    },
    title: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '16px',
        color: '#000',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    reviewCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingBottom: '20px',
        borderBottom: '1px solid #F5F5F5',
    },
    header: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    meta: {
        display: 'flex',
        flexDirection: 'column',
    },
    author: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#212121',
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    date: {
        fontSize: '12px',
        color: '#9E9E9E',
        marginLeft: '4px',
    },
    text: {
        fontSize: '14px',
        color: '#424242',
        lineHeight: '1.5',
        margin: 0,
    },
};

export default VenueReviews;
