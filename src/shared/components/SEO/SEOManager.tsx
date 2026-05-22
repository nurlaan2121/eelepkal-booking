import React, { useEffect } from 'react';

export interface SchemaObject {
    [key: string]: unknown;
}

interface SEOManagerProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
    noIndex?: boolean;
    schema?: SchemaObject | SchemaObject[];
}

const BASE_URL = 'https://client.eelepkal.com';
const SITE_NAME = 'Ээлеп кал';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;
const SCHEMA_SCRIPT_PREFIX = 'seo-schema-';

const SEOManager: React.FC<SEOManagerProps> = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonical,
    noIndex = false,
    schema,
}) => {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        document.title = fullTitle;

        const setMeta = (selector: string, attr: string, value: string, attrValue: string) => {
            let el = document.querySelector(selector) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, attrValue);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        };

        // Primary meta
        if (description) setMeta('meta[name="description"]', 'name', description, 'description');
        if (keywords) setMeta('meta[name="keywords"]', 'name', keywords, 'keywords');

        // Robots
        setMeta('meta[name="robots"]', 'name',
            noIndex ? 'noindex, nofollow' : 'index, follow',
            'robots'
        );

        // Open Graph
        const resolvedOgTitle = ogTitle || fullTitle;
        const resolvedOgDesc = ogDescription || description || '';
        const resolvedOgImage = ogImage || DEFAULT_IMAGE;
        const resolvedOgUrl = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL);

        const setOg = (property: string, content: string) => {
            if (!content) return;
            let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('property', property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setOg('og:title', resolvedOgTitle);
        setOg('og:description', resolvedOgDesc);
        setOg('og:image', resolvedOgImage);
        setOg('og:url', resolvedOgUrl);
        setOg('og:site_name', SITE_NAME);
        setOg('og:type', 'website');
        setOg('og:locale', 'ru_KG');

        // Twitter Cards
        const setTwitter = (name: string, content: string) => {
            if (!content) return;
            let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('name', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setTwitter('twitter:card', 'summary_large_image');
        setTwitter('twitter:title', resolvedOgTitle);
        setTwitter('twitter:description', resolvedOgDesc);
        setTwitter('twitter:image', resolvedOgImage);

        // Canonical link
        const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
        let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonicalUrl);

        // JSON-LD Structured Data
        // Remove all previously injected schema scripts
        document.querySelectorAll(`script[id^="${SCHEMA_SCRIPT_PREFIX}"]`).forEach(s => s.remove());

        if (schema) {
            const schemas = Array.isArray(schema) ? schema : [schema];
            schemas.forEach((schemaObj, idx) => {
                const script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                script.id = `${SCHEMA_SCRIPT_PREFIX}${idx}`;
                script.textContent = JSON.stringify(schemaObj, null, 0);
                document.head.appendChild(script);
            });
        }

        // Cleanup on unmount
        return () => {
            // Restore robots tag to default on unmount
            const robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
            if (robotsMeta) robotsMeta.setAttribute('content', 'index, follow');
            // Remove injected schema scripts
            document.querySelectorAll(`script[id^="${SCHEMA_SCRIPT_PREFIX}"]`).forEach(s => s.remove());
        };
    }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, noIndex, schema]);

    return null;
};

export default SEOManager;
