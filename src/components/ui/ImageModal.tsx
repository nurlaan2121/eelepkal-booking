import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useImageStore } from '../../shared/stores/imageStore';

const ImageModal: React.FC = () => {
    const { isOpen, images, currentIndex, nextImage, prevImage, closeImage } = useImageStore();
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Preload images
            images.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, images]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) nextImage();
        if (isRightSwipe) prevImage();
    };

    if (!isOpen || images.length === 0) return null;

    const imageUrl = images[currentIndex];

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

            <div
                style={styles.imageWrapper}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.length > 1 && (
                    <button
                        style={{ ...styles.navBtn, left: '10px' }}
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                        <ChevronLeft size={28} color="#FFF" />
                    </button>
                )}

                <img
                    key={imageUrl}
                    src={imageUrl}
                    alt="Full size"
                    style={styles.image}
                    className="animate-fade-in"
                />

                {images.length > 1 && (
                    <button
                        style={{ ...styles.navBtn, right: '10px' }}
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                        <ChevronRight size={28} color="#FFF" />
                    </button>
                )}
            </div>

            {images.length > 1 && (
                <div style={styles.pagination}>
                    {images.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.dot,
                                backgroundColor: i === currentIndex ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                transform: i === currentIndex ? 'scale(1.2)' : 'scale(1)',
                            }}
                        />
                    ))}
                </div>
            )}
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
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease',
    },
    navBtn: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 2005,
        backdropFilter: 'blur(5px)',
    },
    pagination: {
        position: 'absolute',
        bottom: '40px',
        display: 'flex',
        gap: '8px',
        zIndex: 2005,
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
    },
};

export default ImageModal;
