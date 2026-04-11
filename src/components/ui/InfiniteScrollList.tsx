import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    keyExtractor: (item: T, index: number) => string | number;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError?: boolean;
    onLoadMore: () => void;
    emptyState?: React.ReactNode;
    errorState?: React.ReactNode;
    skeleton?: React.ReactNode;
    containerStyle?: React.CSSProperties;
    gap?: number;
}

function InfiniteScrollList<T>({
    items,
    renderItem,
    keyExtractor,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError = false,
    onLoadMore,
    emptyState,
    errorState,
    skeleton,
    containerStyle,
    gap = 16,
}: InfiniteScrollListProps<T>) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    if (isLoading) {
        return (
            <>
                {skeleton ?? <DefaultSkeleton />}
            </>
        );
    }

    if (isError) {
        return (
            <>
                {errorState ?? (
                    <div style={styles.center}>
                        <p style={styles.errorText}>Ошибка при загрузке данных</p>
                    </div>
                )}
            </>
        );
    }

    if (items.length === 0) {
        return (
            <>
                {emptyState ?? (
                    <div style={styles.center}>
                        <p style={styles.emptyText}>Нет данных</p>
                    </div>
                )}
            </>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap, ...containerStyle }}>
            {items.map((item, index) => (
                <React.Fragment key={keyExtractor(item, index)}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}

            {/* Sentinel element for IntersectionObserver */}
            <div ref={sentinelRef} style={styles.sentinel}>
                {isFetchingNextPage && (
                    <Loader2 size={24} color="#FF9800" className="animate-spin" />
                )}
            </div>
        </div>
    );
}

const DefaultSkeleton: React.FC = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeletonCard} className="animate-pulse">
                <div style={styles.skeletonImage} />
                <div style={styles.skeletonContent}>
                    <div style={{ ...styles.skeletonLine, width: '65%' }} />
                    <div style={{ ...styles.skeletonLine, width: '40%' }} />
                    <div style={{ ...styles.skeletonLine, width: '30%' }} />
                </div>
            </div>
        ))}
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    sentinel: {
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 0',
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '48px',
        gap: '12px',
    },
    emptyText: {
        fontSize: '16px',
        color: '#9E9E9E',
        fontWeight: '500',
    },
    errorText: {
        fontSize: '16px',
        color: '#F44336',
        fontWeight: '600',
    },
    skeletonCard: {
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    skeletonImage: {
        height: '140px',
        backgroundColor: '#F0F0F0',
    },
    skeletonContent: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    skeletonLine: {
        height: '14px',
        backgroundColor: '#F0F0F0',
        borderRadius: '4px',
    },
};

export default InfiniteScrollList;
