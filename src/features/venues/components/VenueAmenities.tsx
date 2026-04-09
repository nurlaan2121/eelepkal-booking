import React from 'react';
import type { VenueAmenities } from '../../../api/dto/venueDto';

interface VenueAmenitiesProps {
    amenities: VenueAmenities | null;
}

const VenueAmenitiesSection: React.FC<VenueAmenitiesProps> = ({ amenities }) => {
    if (!amenities) return null;

    const services = Object.values(amenities).filter(Boolean);

    if (services.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Удобства и услуги</h2>
            <div style={styles.list}>
                {services.map((service, idx) => (
                    <div key={idx} style={styles.item}>
                        <div style={styles.bullet}>•</div>
                        <span style={styles.label}>{service}</span>
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
    item: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
    },
    bullet: {
        color: '#FF9800',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '1',
    },
    label: {
        fontSize: '16px',
        color: '#212121',
        fontWeight: '500',
    },
};

export default VenueAmenitiesSection;
