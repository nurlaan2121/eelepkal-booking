import React from 'react';
import { MapPin, Instagram, Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                {/* Brand */}
                <div style={styles.brandCol}>
                    <div style={styles.logoRow}>
                        <div style={styles.logoCircle}>
                            <MapPin size={16} color="#FF6B35" />
                        </div>
                        <span style={styles.brandName}>Ээлеп кал</span>
                    </div>
                    <p style={styles.tagline}>
                        Бронирование столиков онлайн<br />по всему Кыргызстану
                    </p>
                </div>

                {/* Links */}
                <div style={styles.linksCol}>
                    <span style={styles.colTitle}>Сервис</span>
                    <a href="/venues" style={styles.link}>Заведения</a>
                    <a href="/search" style={styles.link}>Поиск</a>
                    <a href="/booking" style={styles.link}>Мои брони</a>
                </div>

                <div style={styles.linksCol}>
                    <span style={styles.colTitle}>Помощь</span>
                    <a href="mailto:support@eelepkal.kg" style={styles.link}>Контакты</a>
                    <a href="#" style={styles.link}>Политика конфиденциальности</a>
                    <a href="#" style={styles.link}>Условия использования</a>
                </div>
            </div>

            <div style={styles.bottom}>
                <span style={styles.copyright}>
                    © 2025 Ээлеп кал. Сделано с <Heart size={12} style={{ display: 'inline', verticalAlign: 'middle', marginBottom: 2 }} color="#FF6B35" /> в Кыргызстане
                </span>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.socialLink}
                    aria-label="Instagram"
                >
                    <Instagram size={20} />
                </a>
            </div>
        </footer>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    footer: {
        backgroundColor: '#1A1A2E',
        color: '#CBD5E1',
        padding: '40px 20px 24px',
        marginTop: 'auto',
    },
    inner: {
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        paddingBottom: '32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    brandCol: {
        flex: '1 1 200px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoCircle: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandName: {
        fontSize: '18px',
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: '-0.3px',
    },
    tagline: {
        fontSize: '14px',
        lineHeight: 1.6,
        color: '#94A3B8',
        margin: 0,
    },
    linksCol: {
        flex: '1 1 140px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    colTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '4px',
    },
    link: {
        fontSize: '14px',
        color: '#94A3B8',
        textDecoration: 'none',
        transition: 'color 0.2s',
        cursor: 'pointer',
    },
    bottom: {
        maxWidth: '900px',
        margin: '24px auto 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
    },
    copyright: {
        fontSize: '13px',
        color: '#64748B',
    },
    socialLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.06)',
        color: '#94A3B8',
        transition: 'all 0.2s',
        textDecoration: 'none',
    },
};

export default Footer;
