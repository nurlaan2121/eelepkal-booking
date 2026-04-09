import React from 'react';
import { MapPin, Utensils, Wallet } from 'lucide-react';
import type { VenueBasicInfo, VenueDetails } from '../../../api/dto/venueDto';

interface VenueInfoProps {
    basic: VenueBasicInfo;
    details: VenueDetails | null;
}

const VenueInfo: React.FC<VenueInfoProps> = ({ basic, details }) => {
    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <div style={styles.iconBox}>
                    <MapPin size={20} color="#FF9800" />
                </div>
                <div style={styles.content}>
                    <span style={styles.label}>Адрес</span>
                    <span style={styles.value}>{basic.address}</span>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.iconBox}>
                    <Utensils size={20} color="#FF9800" />
                </div>
                <div style={styles.content}>
                    <span style={styles.label}>Тип заведения / Кухня</span>
                    <span style={styles.value}>{details?.typesOfCuisines || 'Не указано'}</span>
                </div>
            </div>

            <div style={styles.row}>
                <div style={styles.iconBox}>
                    <Wallet size={20} color="#FF9800" />
                </div>
                <div style={styles.content}>
                    <span style={styles.label}>Средний чек</span>
                    <span style={styles.value}>{basic.averageCheck} сом</span>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        backgroundColor: '#F9F9F9',
        borderRadius: '24px',
        marginBottom: '24px',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    iconBox: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        backgroundColor: '#FFE0B2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '12px',
        color: '#757575',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    value: {
        fontSize: '16px',
        color: '#212121',
        fontWeight: '700',
    },
};

export default VenueInfo;
