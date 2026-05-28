import React from 'react';
import { Phone, Mail, Instagram, MessageCircle, MapPin, ExternalLink, Loader2, AlertCircle, Globe, Facebook } from 'lucide-react';
import type { VenueContacts as VenueContactsType } from '../../../api/dto/venueDto';

interface VenueContactsProps {
    contacts: VenueContactsType | null;
    isLoading?: boolean;
    isError?: boolean;
}

// Helper to check if a value is empty
const isEmpty = (value: string | null | undefined): boolean => {
    if (!value) return true;
    return value.trim() === '';
};

// Helper to validate and format URL
const formatUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    
    // If it's already a valid URL with protocol, return as-is
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    
    // If it looks like a domain (contains dot), add https://
    if (trimmed.includes('.')) {
        return `https://${trimmed}`;
    }
    
    // Otherwise, it's probably just text without a valid URL
    return '';
};

// Helper to extract domain from URL for display
const extractDomain = (url: string): string => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (e) {
        return url;
    }
};

// Helper to format phone number
const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('996') && cleaned.length === 12) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    if (cleaned.startsWith('+')) {
        return phone;
    }
    return phone;
};

// Helper to format social media username or URL
const formatSocialMedia = (value: string, platform: 'instagram' | 'telegram' | 'facebook'): { displayValue: string; url: string } => {
    const trimmed = value.trim();
    
    // If it's a full URL
    if (/^https?:\/\//i.test(trimmed)) {
        try {
            const urlObj = new URL(trimmed);
            
            if (platform === 'instagram') {
                const match = trimmed.match(/instagram\.com\/([^/?#]+)/);
                if (match && match[1]) {
                    return { displayValue: `@${match[1]}`, url: trimmed };
                }
            } else if (platform === 'telegram') {
                const match = trimmed.match(/t\.me\/([^/?#]+)/);
                if (match && match[1]) {
                    return { displayValue: `@${match[1]}`, url: trimmed };
                }
            } else if (platform === 'facebook') {
                const match = trimmed.match(/facebook\.com\/([^/?#]+)/);
                if (match && match[1]) {
                    return { displayValue: match[1], url: trimmed };
                }
            }
            
            return { displayValue: urlObj.hostname.replace('www.', ''), url: trimmed };
        } catch (e) {
            return { displayValue: trimmed, url: trimmed };
        }
    }
    
    // If it's just a username or text
    const cleanUsername = trimmed.replace('@', '');
    let url = '';
    
    if (platform === 'instagram') {
        url = `https://instagram.com/${cleanUsername}`;
    } else if (platform === 'telegram') {
        url = `https://t.me/${cleanUsername}`;
    } else if (platform === 'facebook') {
        url = `https://facebook.com/${cleanUsername}`;
    }
    
    return { displayValue: `@${cleanUsername}`, url };
};

// Helper to create WhatsApp URL with pre-filled message
const createWhatsAppUrl = (whatsappValue: string): string => {
    const defaultMessage = "Здравствуйте! Пишу вам через 'Ээлеп кал' хотел(а) уточнить информацию.";
    
    try {
        // Check if it's already a URL
        if (whatsappValue.startsWith('http')) {
            // Extract phone number from URL
            let phoneNumber = '';
            
            // Handle wa.me URLs
            const waMeMatch = whatsappValue.match(/wa\.me\/([\d]+)/);
            if (waMeMatch && waMeMatch[1]) {
                phoneNumber = waMeMatch[1];
            } else {
                // Try to extract from other URL formats
                try {
                    const urlObj = new URL(whatsappValue);
                    // Remove any existing query params and get clean base
                    const baseUrl = `${urlObj.origin}${urlObj.pathname}`;
                    return `${baseUrl}?text=${encodeURIComponent(defaultMessage)}`;
                } catch (e) {
                    // If URL parsing fails, use as-is with message
                    return `${whatsappValue}?text=${encodeURIComponent(defaultMessage)}`;
                }
            }
            
            // Create new wa.me URL with pre-filled message
            return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
        }
        
        // If it's just a phone number, create wa.me URL
        const cleanPhone = whatsappValue.replace(/\D/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;
    } catch (error) {
        // Fallback: return original value if something goes wrong
        console.warn('Failed to create WhatsApp URL with message:', error);
        return whatsappValue.startsWith('http') ? whatsappValue : `https://wa.me/${whatsappValue.replace(/\D/g, '')}`;
    }
};

// Helper to get field value with fallback for different API key formats
const getField = (contacts: any, ...keys: string[]): string | undefined => {
    for (const key of keys) {
        if (contacts[key] && !isEmpty(contacts[key])) {
            return contacts[key];
        }
    }
    return undefined;
};

const VenueContacts: React.FC<VenueContactsProps> = ({ contacts, isLoading, isError }) => {
    if (isLoading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Контакты</h2>
                <div style={styles.loadingState}>
                    <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                    <p style={styles.loadingText}>Загрузка контактов...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Контакты</h2>
                <div style={styles.errorState}>
                    <AlertCircle size={32} style={{ color: 'var(--color-error)' }} />
                    <p style={styles.errorText}>Не удалось загрузить контакты</p>
                </div>
            </div>
        );
    }

    if (!contacts) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Контакты</h2>
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>Контакты пока не добавлены</p>
                </div>
            </div>
        );
    }

    // Build contact items array, filtering out empty values
    const contactItems: Array<{
        type: 'phone' | 'email' | 'instagram' | 'whatsapp' | 'telegram' | '2gis' | 'website' | 'facebook';
        icon: React.ReactNode;
        label: string;
        value: string;
        displayValue?: string;
        link: string;
        linkLabel: string;
        color: string;
        bgColor: string;
    }> = [];

    // Phone
    const phoneNumber = getField(contacts, 'phone number', 'phoneNumber', 'Phone', 'phone');
    if (phoneNumber) {
        contactItems.push({
            type: 'phone',
            icon: <Phone size={22} />,
            label: 'Телефон',
            value: phoneNumber,
            displayValue: formatPhoneNumber(phoneNumber),
            link: `tel:${phoneNumber.replace(/\s/g, '')}`,
            linkLabel: 'Позвонить',
            color: '#FFA600FF',
            bgColor: '#D1FAE5',
        });
    }

    // WhatsApp
    const whatsapp = getField(contacts, 'WhatsApp', 'whatsapp', 'Whatsapp');
    if (whatsapp) {
        const whatsappUrl = createWhatsAppUrl(whatsapp);
        contactItems.push({
            type: 'whatsapp',
            icon: <MessageCircle size={22} />,
            label: 'WhatsApp',
            value: 'Написать в WhatsApp',
            link: whatsappUrl,
            linkLabel: 'Написать',
            color: '#FFA600FF',
            bgColor: '#D1FAE5',
        });
    }

    // Telegram
    const telegram = getField(contacts, 'telegram', 'Telegram');
    if (telegram) {
        const { displayValue, url: telegramUrl } = formatSocialMedia(telegram, 'telegram');
        contactItems.push({
            type: 'telegram',
            icon: <MessageCircle size={22} />,
            label: 'Telegram',
            value: displayValue,
            link: telegramUrl,
            linkLabel: 'Открыть',
            color: '#FFA600FF',
            bgColor: '#DBEAFE',
        });
    }

    // Instagram
    const instagram = getField(contacts, 'Instagram', 'instagram', 'Instagram');
    if (instagram) {
        const { displayValue: displayUsername, url: instagramUrl } = formatSocialMedia(instagram, 'instagram');
        contactItems.push({
            type: 'instagram',
            icon: <Instagram size={22} />,
            label: 'Instagram',
            value: displayUsername,
            link: instagramUrl,
            linkLabel: 'Открыть',
            color: '#FFA600FF',
            bgColor: '#FCE7F3',
        });
    }

    // 2GIS
    const gis2 = getField(contacts, '2GIS', 'gis2', '2gis');
    if (gis2) {
        const gis2Url = formatUrl(gis2);
        contactItems.push({
            type: '2gis',
            icon: <MapPin size={22} />,
            label: '2GIS',
            value: 'Посмотреть на карте',
            link: gis2Url || gis2,
            linkLabel: 'Открыть карту',
            color: '#FFA600FF',
            bgColor: '#D1FAE5',
        });
    }

    // Website
    const website = getField(contacts, 'website', 'Website', 'site');
    if (website) {
        const websiteUrl = formatUrl(website);
        if (websiteUrl) {
            contactItems.push({
                type: 'website',
                icon: <Globe size={22} />,
                label: 'Веб-сайт',
                value: extractDomain(websiteUrl),
                link: websiteUrl,
                linkLabel: 'Открыть',
                color: '#FFA600FF',
                bgColor: '#DBEAFE',
            });
        }
    }

    // Facebook
    const facebook = getField(contacts, 'facebook', 'Facebook');
    if (facebook) {
        const { displayValue, url: facebookUrl } = formatSocialMedia(facebook, 'facebook');
        contactItems.push({
            type: 'facebook',
            icon: <Facebook size={22} />,
            label: 'Facebook',
            value: displayValue,
            link: facebookUrl,
            linkLabel: 'Открыть',
            color: '#FFA600FF',
            bgColor: '#DBEAFE',
        });
    }

    // Email
    if (!isEmpty(contacts.email)) {
        const email = contacts.email!;
        contactItems.push({
            type: 'email',
            icon: <Mail size={22} />,
            label: 'Email',
            value: email,
            link: `mailto:${email}`,
            linkLabel: 'Написать',
            color: '#FFA600FF',
            bgColor: '#EDE9FE',
        });
    }

    if (contactItems.length === 0) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Контакты</h2>
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>Контакты пока не добавлены</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Контакты</h2>
            <div style={styles.grid}>
                {contactItems.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.link}
                        target={item.type === 'phone' || item.type === 'email' ? undefined : '_blank'}
                        rel={item.type === 'phone' || item.type === 'email' ? undefined : 'noopener noreferrer'}
                        style={styles.card}
                        className="card-hover"
                        aria-label={`${item.linkLabel} ${item.label}`}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    >
                        <div style={{
                            ...styles.iconWrapper,
                            backgroundColor: item.bgColor,
                            color: item.color,
                        }}>
                            {item.icon}
                        </div>
                        <div style={styles.cardContent}>
                            <span style={styles.cardLabel}>{item.label}</span>
                            <span style={styles.cardValue}>{item.displayValue || item.value}</span>
                        </div>
                        <div style={styles.cardAction}>
                            <span style={styles.actionText}>{item.linkLabel}</span>
                            <ExternalLink size={16} style={{ color: item.color }} />
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
        borderRadius: 'var(--radius-2xl)',
        marginBottom: '24px',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-sm)',
    },
    title: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '20px',
        color: 'var(--color-text)',
        letterSpacing: '-0.3px',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-light)',
        textDecoration: 'none',
        transition: 'all var(--transition-base)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all var(--transition-base)',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
    },
    cardLabel: {
        fontSize: '12px',
        color: 'var(--color-text-secondary)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px',
    },
    cardValue: {
        fontSize: '15px',
        color: 'var(--color-text)',
        fontWeight: '700',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    cardAction: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
    },
    actionText: {
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--color-text-secondary)',
    },
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '12px',
    },
    loadingText: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        fontWeight: '500',
        margin: 0,
    },
    errorState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '12px',
    },
    errorText: {
        fontSize: '14px',
        color: 'var(--color-error)',
        fontWeight: '600',
        margin: 0,
        textAlign: 'center',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    emptyText: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        fontWeight: '500',
        margin: 0,
        textAlign: 'center',
    },
};

export default VenueContacts;
