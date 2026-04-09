import React from 'react';

interface VenueDescriptionProps {
    description: string | null;
}

const VenueDescription: React.FC<VenueDescriptionProps> = ({ description }) => {
    if (!description) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>О заведении</h2>
            <p style={styles.text}>{description}</p>
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
    text: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#424242',
        margin: 0,
        whiteSpace: 'pre-line',
    },
};

export default VenueDescription;
