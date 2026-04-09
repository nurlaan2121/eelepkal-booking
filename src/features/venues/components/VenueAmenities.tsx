import React from 'react';
import { Camera, Shirt, Thermometer, Accessibility, Tv } from 'lucide-react';
import type { VenueAmenities } from '../../../api/dto/venueDto';

interface VenueAmenitiesProps {
    amenities: VenueAmenities | null;
}

const amenityIconMap: Record<string, React.ReactNode> = {
    photoShooting: <Camera size={20} />,
    changingRoom: <Shirt size={20} />,
    heating: <Thermometer size={20} />,
    childChair: <Accessibility size={20} />,
    cinema: <Tv size={20} />,
};

const amenityLabelMap: Record<string, string> = {
    photoShooting: 'Фотосъемка',
    changingRoom: 'Гардероб',
    heating: 'Обогрев',
    childChair: 'Детские стульчики',
    cinema: 'Кинозал',
};

const VenueAmenitiesSection: React.FC<VenueAmenitiesProps> = ({ amenities }) => {
    if (!amenities) return null;

    const activeAmenities = Object.entries(amenities).filter(([, val]) => val === 'true');

    if (activeAmenities.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Удобства</h2>
            <div style={styles.grid}>
                {activeAmenities.map(([amenityKey]) => (
                    <div key={amenityKey} style={styles.item}>
                        <div style={styles.iconBox}>
                            {amenityIconMap[amenityKey] || <Accessibility size={20} />}
                        </div>
                        <span style={styles.label}>{amenityLabelMap[amenityKey] || amenityKey}</span>
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '16px',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px',
    },
    iconBox: {
        color: '#FF9800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: '14px',
        color: '#424242',
        fontWeight: '600',
    },
};

export default VenueAmenitiesSection;
