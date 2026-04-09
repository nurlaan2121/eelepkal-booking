import React from 'react';
import { Phone, Mail, Instagram, MessageCircle, Map } from 'lucide-react';
import type { VenueContacts } from '../../../api/dto/venueDto';

interface VenueContactsProps {
    contacts: VenueContacts | null;
}

const VenueContacts: React.FC<VenueContactsProps> = ({ contacts }) => {
    if (!contacts) return null;

    const contactItems = [
        { icon: <Phone size={20} />, label: 'Телефон', value: contacts.phoneNumber, link: `tel:${contacts.phoneNumber}` },
        { icon: <Mail size={20} />, label: 'Email', value: contacts.email, link: `mailto:${contacts.email}` },
        { icon: <Instagram size={20} />, label: 'Instagram', value: contacts.instagram, link: contacts.instagram?.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram}` },
        { icon: <MessageCircle size={20} />, label: 'Telegram', value: contacts.telegram, link: contacts.telegram?.startsWith('http') ? contacts.telegram : `https://t.me/${contacts.telegram?.replace('@', '')}` },
        { icon: <Map size={20} />, label: '2GIS', value: contacts.gis2 ? 'Открыть в 2GIS' : null, link: contacts.gis2 },
    ].filter(item => item.value);

    if (contactItems.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Контакты</h2>
            <div style={styles.list}>
                {contactItems.map((item, idx) => (
                    <a key={idx} href={item.link || '#'} target="_blank" rel="noopener noreferrer" style={styles.item}>
                        <div style={styles.iconBox}>{item.icon}</div>
                        <div style={styles.content}>
                            <span style={styles.label}>{item.label}</span>
                            <span style={styles.value}>{item.value}</span>
                        </div>
                    </a>
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
        alignItems: 'center',
        gap: '16px',
        padding: '12px',
        borderRadius: '16px',
        backgroundColor: '#F9F9F9',
        textDecoration: 'none',
        transition: 'transform 0.2s',
    },
    iconBox: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: '#FFE0B2',
        color: '#FF9800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '11px',
        color: '#757575',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: '14px',
        color: '#212121',
        fontWeight: '600',
    },
};

export default VenueContacts;
