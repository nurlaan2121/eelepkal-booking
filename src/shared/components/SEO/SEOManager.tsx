import React, { useEffect } from 'react';

interface SEOManagerProps {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    canonical
}) => {
    useEffect(() => {
        const baseTitle = 'Ээлеп кал';
        const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
        document.title = fullTitle;

        // Update meta description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);
        }

        // Update OpenGraph tags
        const updateMeta = (property: string, content?: string) => {
            if (!content) return;
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMeta('og:title', ogTitle || fullTitle);
        updateMeta('og:description', ogDescription || description);
        updateMeta('og:image', ogImage);
        updateMeta('og:url', window.location.href);

        // Update canonical
        if (canonical) {
            let linkCanonical = document.querySelector('link[rel="canonical"]');
            if (!linkCanonical) {
                linkCanonical = document.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                document.head.appendChild(linkCanonical);
            }
            linkCanonical.setAttribute('href', canonical);
        }
    }, [title, description, ogTitle, ogDescription, ogImage, canonical]);

    return null;
};

export default SEOManager;
