import React, { useEffect, useRef, useState } from 'react';
import Skeleton from './Skeleton';
import { getImageUrl, type ImageVariant } from '../../shared/utils/imageUrl';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackColor?: string;
    showSkeleton?: boolean;
    variant?: ImageVariant;
    priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    style,
    className,
    fallbackColor = '#F3F4F6',
    showSkeleton = true,
    variant = 'thumbnail',
    priority = false,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [isVisible, setIsVisible] = useState(priority);
    const containerRef = useRef<HTMLDivElement>(null);
    const resolvedSrc = getImageUrl(src, variant);

    useEffect(() => {
        setIsLoaded(false);
        setError(false);
        if (priority) {
            setIsVisible(true);
            return;
        }
        const element = containerRef.current;
        if (!element || !('IntersectionObserver' in window)) {
            setIsVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '300px 0px' });
        observer.observe(element);
        return () => observer.disconnect();
    }, [resolvedSrc, priority]);

    return (
        <div ref={containerRef} style={{ ...styles.container, ...(style as any) }} className={className}>
            {!isLoaded && !error && showSkeleton && (
                <Skeleton width="100%" height="100%" borderRadius="inherit" />
            )}

            {error ? (
                <div style={{ ...styles.fallback, backgroundColor: fallbackColor }}>
                    <span style={styles.errorText}>!</span>
                </div>
            ) : isVisible ? (
                <img
                    src={resolvedSrc}
                    alt={alt}
                    style={{
                        ...styles.image,
                        opacity: isLoaded ? 1 : 0,
                    }}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setError(true)}
                    {...props}
                />
            ) : null}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'relative',
        overflow: 'hidden',
        display: 'block',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'opacity 0.4s ease-in-out',
        display: 'block',
    },
    fallback: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'var(--color-text-muted)',
        fontSize: '24px',
        fontWeight: 'bold',
    },
};

export default OptimizedImage;
