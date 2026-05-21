import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { useImageStore } from '../../shared/stores/imageStore';

const ImageModal: React.FC = () => {
    const { isOpen, imageUrl, closeImage } = useImageStore();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen || !imageUrl) return null;

    return (
        <div style={styles.overlay} onClick={closeImage}>
            <div style={styles.header}>
                <div style={styles.hint}>
                    <ZoomIn size={16} />
                    Полноэкранный режим
                </div>
                <button style={styles.closeBtn} onClick={closeImage}>
                    <X size={24} color="#FFF" />
                </button>
            </div>

            <div style={styles.imageWrapper} onClick={(e) => e.stopPropagation()}>
                <img
                    src={imageUrl}
                    alt="Full size"
                    style={styles.image}
                    className="animate-fade-in"
                />
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(10px)',
    },
    header: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2001,
    },
    hint: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        backdropFilter: 'blur(5px)',
    },
    closeBtn: {
        background: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
};

export default ImageModal;
