import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackColor?: string;
    showSkeleton?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    style,
    className,
    fallbackColor = '#F3F4F6',
    showSkeleton = true,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setError(true);
    }, [src]);

    return (
        <div style={{ ...styles.container, ...(style as any) }} className={className}>
            {!isLoaded && !error && showSkeleton && (
                <Skeleton width="100%" height="100%" borderRadius="inherit" />
            )}

            {error ? (
                <div style={{ ...styles.fallback, backgroundColor: fallbackColor }}>
                    <span style={styles.errorText}>!</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        ...styles.image,
                        opacity: isLoaded ? 1 : 0,
                    }}
                    loading="lazy"
                    {...props}
                />
            )}
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
