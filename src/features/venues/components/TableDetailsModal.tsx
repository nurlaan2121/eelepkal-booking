import React from 'react';
import { X, Users, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { venueService } from '../../../api/services/venueService';
import { translateTableType } from '../../../shared/utils/dateFormatter';

interface TableDetailsModalProps {
    tableId: number;
    visitTime: string;
    onClose: () => void;
    onBook: () => void;
}

const TableDetailsModal: React.FC<TableDetailsModalProps> = ({ tableId, visitTime, onClose, onBook }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    
    const { data: table, isLoading, error } = useQuery({
        queryKey: ['tableDetails', tableId, visitTime],
        queryFn: () => venueService.getTableDetails(tableId, visitTime),
    });

    if (isLoading) return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.loading}>Загрузка деталей столика...</div>
            </div>
        </div>
    );

    if (error || !table) return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <div style={styles.error}>Ошибка при загрузке данных</div>
                <button onClick={onClose} style={styles.closeBtn}>Закрыть</button>
            </div>
        </div>
    );

    // Get all image URLs from the images object
    const imageUrls = Object.values(table.images).filter(Boolean);
    const hasMultipleImages = imageUrls.length > 1;
    const currentImageUrl = imageUrls[currentImageIndex] || '';
    
    // Debug: Log images to console
    console.log('📸 Table Images:', {
        total: imageUrls.length,
        urls: imageUrls,
        currentIndex: currentImageIndex,
        hasMultiple: hasMultipleImages
    });

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeIcon}>
                    <X size={24} />
                </button>

                <div style={styles.imageContainer}>
                    <img src={currentImageUrl} alt={table.title} style={styles.image} />
                    
                    {/* Navigation arrows for multiple images */}
                    {hasMultipleImages && (
                        <>
                            <button
                                style={{ ...styles.imageNavBtn, left: '12px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
                                }}
                                aria-label="Предыдущее фото"
                            >
                                <ChevronLeft size={24} color="#FFF" />
                            </button>
                            <button
                                style={{ ...styles.imageNavBtn, right: '12px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
                                }}
                                aria-label="Следующее фото"
                            >
                                <ChevronRight size={24} color="#FFF" />
                            </button>
                            
                            {/* Image counter */}
                            <div style={styles.imageCounter}>
                                {currentImageIndex + 1} / {imageUrls.length}
                            </div>
                            
                            {/* Dots indicator */}
                            <div style={styles.dotsContainer}>
                                {imageUrls.map((_, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            ...styles.dot,
                                            backgroundColor: idx === currentImageIndex ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                                            transform: idx === currentImageIndex ? 'scale(1.3)' : 'scale(1)',
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    
                    <div style={{
                        ...styles.statusBadge,
                        backgroundColor: table.status === 'OPEN' ? '#4CAF50' : '#F44336'
                    }}>
                        {table.status === 'OPEN' ? 'Свободен' : 'Занят'}
                    </div>
                </div>

                <div style={styles.body}>
                    <div style={styles.titleRow}>
                        <h2 style={styles.name}>{table.title}</h2>
                        <span style={styles.type}>{translateTableType(table.tableType)}</span>
                    </div>

                    <div style={styles.mainInfo}>
                        <div style={styles.infoItem}>
                            <Users size={18} color="#FF9800" />
                            <span style={styles.infoText}>{table.capacity} чел.</span>
                        </div>
                        <div style={styles.infoItem}>
                            <Shield size={18} color="#FF9800" />
                            <span style={styles.infoText}>{table.deposit}</span>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Описание</h3>
                        <p style={styles.description}>{table.description}</p>
                    </div>

                    {table.amenities.length > 0 && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Удобства</h3>
                            <div style={styles.tags}>
                                {table.amenities.map((item, idx) => (
                                    <span key={idx} style={styles.tag}>{item}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {table.eventTypes.length > 0 && (
                        <div style={styles.section}>
                            <h3 style={styles.sectionTitle}>Подходит для мероприятий</h3>
                            <div style={styles.tags}>
                                {table.eventTypes.map((item, idx) => (
                                    <span key={idx} style={{ ...styles.tag, backgroundColor: '#E3F2FD', color: '#1976D2' }}>{item}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        style={{
                            ...styles.actionBtn,
                            backgroundColor: table.status === 'BUSY' ? '#E0E0E0' : '#212121',
                            cursor: table.status === 'BUSY' ? 'not-allowed' : 'pointer'
                        }}
                        onClick={onBook}
                        disabled={table.status === 'BUSY'}
                    >
                        {table.status === 'BUSY' ? 'Столик занят' : 'Забронировать'}
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
        maxWidth: '500px',
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto' as any,
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
        height: '240px',
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    statusBadge: {
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        padding: '6px 12px',
        borderRadius: '8px',
        color: '#FFF',
        fontSize: '12px',
        fontWeight: '700',
    },
    body: {
        padding: '24px',
    },
    titleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    name: {
        fontSize: '22px',
        fontWeight: '800',
        margin: 0,
        color: '#212121',
    },
    type: {
        fontSize: '14px',
        padding: '4px 10px',
        backgroundColor: '#F5F5F5',
        borderRadius: '8px',
        color: '#757575',
        fontWeight: '600',
    },
    mainInfo: {
        display: 'flex',
        gap: '20px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#FFF8E1',
        borderRadius: '16px',
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    infoText: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#424242',
    },
    section: {
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '10px',
        color: '#212121',
    },
    description: {
        fontSize: '14px',
        color: '#616161',
        lineHeight: '1.5',
        margin: 0,
    },
    tags: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    tag: {
        fontSize: '12px',
        padding: '6px 12px',
        backgroundColor: '#F5F5F5',
        borderRadius: '8px',
        color: '#424242',
        fontWeight: '600',
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
        marginTop: '8px',
    },
    loading: {
        padding: '60px',
        textAlign: 'center',
        color: '#757575',
    },
    error: {
        padding: '40px',
        textAlign: 'center',
        color: '#F44336',
    },
    closeBtn: {
        margin: '0 auto',
        display: 'block',
        padding: '8px 24px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#F5F5F5',
        cursor: 'pointer',
    },
    imageNavBtn: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10,
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s ease',
    },
    imageCounter: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#FFF',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(4px)',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 10,
    },
    dot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
    },
};

export default TableDetailsModal;
