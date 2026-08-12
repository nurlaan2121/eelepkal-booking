export type ImageVariant = 'thumbnail' | 'preview' | 'full';

/**
 * Serves a size appropriate for the UI while keeping persisted image URLs unchanged.
 * Static assets and non-S3 URLs are returned as-is to avoid proxying local branding.
 */
export const getImageUrl = (source: string | null | undefined, variant: ImageVariant = 'thumbnail'): string => {
    if (!source || source.startsWith('/') || source.startsWith('data:') || source.startsWith('blob:')) return source || '';
    if (!/\.amazonaws\.com(?:\/|$)/i.test(source)) return source;
    return `/api/s3/image?url=${encodeURIComponent(source)}&variant=${variant.toUpperCase()}`;
};
