import React from 'react';
import { Star, MapPin } from 'lucide-react';
import type { VenueFilial } from '../../../api/dto/venueDto';

interface VenueFilialsProps {
    filials: VenueFilial[];
}

const VenueFilials: React.FC<VenueFilialsProps> = ({ filials }) => {
    if (!filials || filials.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Филиалы</h2>
            <div style={styles.list}>
                {filials.map((filial) => (
                    <div key={filial.id} style={styles.card}>
                        <div style={styles.cardInfo}>
                            <h3 style={styles.filialName}>{filial.name}</h3>
                            <div style={styles.row}>
                                <MapPin size={14} color="#757575" />
                                <span style={styles.address}>{filial.address}</span>
                            </div>
                        </div>
                        <div style={styles.ratingBox}>
                            <Star size={16} color="#FFD700" fill="#FFD700" />
                            <span style={styles.ratingValue}>{filial.rating.toFixed(1)}</span>
                        </div>
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
        gap: '12px',
    },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#F9F9F9',
        borderRadius: '20px',
    },
    cardInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    filialName: {
        fontSize: '16px',
        fontWeight: '700',
        margin: 0,
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    address: {
        fontSize: '13px',
        color: '#757575',
    },
    ratingBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#FFE0B2',
        padding: '6px 12px',
        borderRadius: '12px',
    },
    ratingValue: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#E65100',
    },
};

export default VenueFilials;
