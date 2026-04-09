import React from 'react';
import { X, MapPin, Scale, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { venueService } from '../../../api/services/venueService';

interface MenuItemDetailsModalProps {
    menuId: number;
    onClose: () => void;
}

const MenuItemDetailsModal: React.FC<MenuItemDetailsModalProps> = ({ menuId, onClose }) => {
    const { data: item, isLoading, error } = useQuery({
        queryKey: ['menuItemDetails', menuId],
        queryFn: () => venueService.getMenuItemById(menuId),
    });

    if (isLoading) return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.loading}>Загрузка деталей...</div>
            </div>
        </div>
    );

    if (error || !item) return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.error}>Ошибка при загрузке данных</div>
                <button onClick={onClose} style={styles.closeBtn}>Закрыть</button>
            </div>
        </div>
    );

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeIcon}>
                    <X size={24} />
                </button>

                <div style={styles.imageContainer}>
                    <img src={item.imageUrl} alt={item.name} style={styles.image} />
                    <button style={styles.favoriteBtn}>
                        <Heart size={20} color={item.favorite ? "#F44336" : "#757575"} fill={item.favorite ? "#F44336" : "transparent"} />
                    </button>
                </div>

                <div style={styles.body}>
                    <div style={styles.titleRow}>
                        <h2 style={styles.name}>{item.name}</h2>
                        <span style={styles.price}>{item.price} KGS</span>
                    </div>

                    {(item.unit || item.value) && (
                        <div style={styles.metaRow}>
                            <Scale size={16} color="#757575" />
                            <span style={styles.metaText}>
                                {item.value} {item.unit}
                            </span>
                        </div>
                    )}

                    {item.addressVenue && (
                        <div style={styles.metaRow}>
                            <MapPin size={16} color="#757575" />
                            <span style={styles.metaText}>{item.addressVenue}</span>
                        </div>
                    )}

                    <div style={styles.descriptionContainer}>
                        <h3 style={styles.sectionTitle}>Описание</h3>
                        <p style={styles.description}>{item.description}</p>
                    </div>

                    <button style={styles.actionBtn} onClick={onClose}>
                        Понятно
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#FFF',
        width: '90%',
        maxWidth: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out',
    },
    closeIcon: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    imageContainer: {
        position: 'relative',
        height: '280px',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    favoriteBtn: {
        position: 'absolute',
        bottom: '-24px',
        right: '24px',
        backgroundColor: '#FFF',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer',
    },
    body: {
        padding: '32px 24px 24px 24px',
    },
    titleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        gap: '12px',
    },
    name: {
        fontSize: '24px',
        fontWeight: '800',
        margin: 0,
        color: '#212121',
    },
    price: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#FF9800',
        whiteSpace: 'nowrap',
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px',
    },
    metaText: {
        fontSize: '14px',
        color: '#757575',
        fontWeight: '500',
    },
    descriptionContainer: {
        marginTop: '20px',
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#212121',
    },
    description: {
        fontSize: '14px',
        color: '#616161',
        lineHeight: '1.6',
        margin: 0,
    },
    actionBtn: {
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        backgroundColor: '#212121',
        color: '#FFF',
        fontSize: '16px',
        fontWeight: '700',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    loading: {
        padding: '40px',
        textAlign: 'center',
        fontSize: '16px',
        color: '#757575',
    },
    error: {
        padding: '24px',
        textAlign: 'center',
        color: '#F44336',
    },
    closeBtn: {
        margin: '16px auto',
        display: 'block',
        padding: '8px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#F5F5F5',
        cursor: 'pointer',
    }
};

export default MenuItemDetailsModal;
