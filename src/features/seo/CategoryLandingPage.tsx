import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../../api/services/venueService';
import VenueCard from '../home/components/VenueCard';
import SEOManager from '../../shared/components/SEO/SEOManager';
import { MapPin, Star, Clock } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import type { SchemaObject } from '../../shared/components/SEO/SEOManager';

export interface CategoryPageConfig {
    slug: string;
    categoryName: string; // for API search
    title: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    canonical: string;
    h1: string;
    h2: string;
    lead: string;
    sections: {
        heading: string;
        body: string;
    }[];
    faq: {
        question: string;
        answer: string;
    }[];
    breadcrumbs: { name: string; url: string }[];
    schema: SchemaObject;
}

interface CategoryLandingPageProps {
    config: CategoryPageConfig;
}

const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({ config }) => {
    const navigate = useNavigate();

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['categoryPage', config.slug],
        queryFn: ({ pageParam = 0 }) =>
            venueService.searchVenues(config.categoryName, {}, pageParam, 20),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === 20 ? allPages.length * 20 : undefined,
    });

    const venues = data?.pages.flat() || [];

    // Breadcrumb JSON-LD
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: config.breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: crumb.name,
            item: crumb.url,
        })),
    };

    // FAQ JSON-LD
    const faqSchema = config.faq.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faq.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
            },
        })),
    } : null;

    const combinedSchema: SchemaObject[] = [config.schema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

    return (
        <div style={styles.page}>
            <SEOManager
                title={config.metaTitle}
                description={config.metaDescription}
                keywords={config.keywords}
                canonical={config.canonical}
                schema={combinedSchema}
            />

            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" style={styles.breadcrumb}>
                {config.breadcrumbs.map((crumb, i) => (
                    <span key={crumb.url} style={styles.breadcrumbItem}>
                        {i > 0 && <span style={styles.breadcrumbSep}> / </span>}
                        {i < config.breadcrumbs.length - 1 ? (
                            <a href={crumb.url} style={styles.breadcrumbLink}>{crumb.name}</a>
                        ) : (
                            <span style={styles.breadcrumbCurrent}>{crumb.name}</span>
                        )}
                    </span>
                ))}
            </nav>

            {/* Hero */}
            <section style={styles.hero}>
                <h1 style={styles.h1}>{config.h1}</h1>
                <p style={styles.lead}>{config.lead}</p>
                <div style={styles.heroStats}>
                    <div style={styles.statItem}><Star size={16} color="#FF6B35" /><span>Проверенные заведения</span></div>
                    <div style={styles.statItem}><Clock size={16} color="#FF6B35" /><span>Бронь за 30 секунд</span></div>
                    <div style={styles.statItem}><MapPin size={16} color="#FF6B35" /><span>Бишкек, Кыргызстан</span></div>
                </div>
            </section>

            {/* Venue Grid */}
            <section style={styles.section} aria-label="Список заведений">
                <h2 style={styles.h2}>{config.h2}</h2>
                {isLoading ? (
                    <div className="responsive-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={styles.skeletonCard}>
                                <Skeleton height="150px" borderRadius="var(--radius-xl) var(--radius-xl) 0 0" />
                                <div style={{ padding: '16px' }}>
                                    <Skeleton width="80%" height="20px" style={{ marginBottom: '8px' }} />
                                    <Skeleton width="40%" height="14px" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : venues.length > 0 ? (
                    <>
                        <div className="responsive-grid">
                            {venues.map((venue, idx) => (
                                venue && typeof venue === 'object' && 'venueId' in venue ? (
                                    <VenueCard key={`${venue.venueId}-${idx}`} venue={venue} />
                                ) : null
                            ))}
                        </div>
                        {hasNextPage && (
                            <div style={styles.loadMoreWrap}>
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    style={styles.loadMoreBtn}
                                >
                                    {isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p style={styles.empty}>
                        Заведения скоро появятся. Пока посмотрите{' '}
                        <a href="/venues" style={styles.inlineLink}>все заведения</a>.
                    </p>
                )}
            </section>

            {/* SEO Content Sections */}
            <section style={styles.seoSection} aria-label="Информация">
                {config.sections.map((sec, i) => (
                    <div key={i} style={styles.seoBlock}>
                        <h3 style={styles.h3}>{sec.heading}</h3>
                        <p style={styles.seoP}>{sec.body}</p>
                    </div>
                ))}
            </section>

            {/* FAQ */}
            {config.faq.length > 0 && (
                <section style={styles.faqSection} aria-label="Часто задаваемые вопросы">
                    <h2 style={styles.h2}>Часто задаваемые вопросы</h2>
                    <div style={styles.faqList}>
                        {config.faq.map((item, i) => (
                            <details key={i} style={styles.faqItem}>
                                <summary style={styles.faqQuestion}>{item.question}</summary>
                                <p style={styles.faqAnswer}>{item.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section style={styles.ctaSection}>
                <h2 style={styles.ctaTitle}>Готовы забронировать столик?</h2>
                <p style={styles.ctaText}>Выберите заведение, время и количество гостей — и ваш столик будет зарезервирован за 30 секунд.</p>
                <button style={styles.ctaBtn} onClick={() => navigate('/search')}>
                    Найти заведение
                </button>
            </section>

            {/* Internal Links */}
            <nav style={styles.internalLinks} aria-label="Другие категории">
                <a href="/restaurants-bishkek" style={styles.internalLink}>Рестораны Бишкека</a>
                <a href="/cafe-bishkek" style={styles.internalLink}>Кафе Бишкека</a>
                <a href="/chayhana-bishkek" style={styles.internalLink}>Чайханы Бишкека</a>
                <a href="/lounge-bishkek" style={styles.internalLink}>Lounge Бишкека</a>
                <a href="/cabins-bishkek" style={styles.internalLink}>Кабинки Бишкека</a>
                <a href="/venues" style={styles.internalLink}>Все заведения</a>
            </nav>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 60px',
        backgroundColor: 'var(--color-bg)',
    },
    breadcrumb: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '16px 0 8px',
        fontSize: '13px',
    },
    breadcrumbItem: { display: 'inline-flex', alignItems: 'center' },
    breadcrumbSep: { color: 'var(--color-text-muted)', margin: '0 4px' },
    breadcrumbLink: { color: 'var(--color-primary)', textDecoration: 'none' },
    breadcrumbCurrent: { color: 'var(--color-text-muted)' },
    hero: {
        padding: '32px 0 24px',
        borderBottom: '1px solid var(--color-border, #E0E0E0)',
        marginBottom: '32px',
    },
    h1: {
        fontSize: 'clamp(24px, 5vw, 40px)',
        fontWeight: '900',
        color: 'var(--color-text)',
        margin: '0 0 12px',
        lineHeight: 1.15,
        letterSpacing: '-0.5px',
    },
    lead: {
        fontSize: '16px',
        color: 'var(--color-text-muted)',
        margin: '0 0 24px',
        lineHeight: 1.6,
        maxWidth: '640px',
    },
    heroStats: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
    },
    statItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-text)',
    },
    section: {
        marginBottom: '48px',
    },
    h2: {
        fontSize: '24px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: '0 0 24px',
        letterSpacing: '-0.3px',
    },
    h3: {
        fontSize: '18px',
        fontWeight: '700',
        color: 'var(--color-text)',
        margin: '0 0 10px',
    },
    skeletonCard: {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
    },
    loadMoreWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '32px',
    },
    loadMoreBtn: {
        backgroundColor: 'var(--color-primary)',
        color: '#FFF',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 32px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    empty: {
        color: 'var(--color-text-muted)',
        fontSize: '16px',
        textAlign: 'center',
        padding: '40px 0',
    },
    inlineLink: { color: 'var(--color-primary)', textDecoration: 'underline' },
    seoSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        padding: '32px',
        marginBottom: '48px',
    },
    seoBlock: {},
    seoP: {
        fontSize: '15px',
        color: 'var(--color-text-muted)',
        lineHeight: 1.7,
        margin: 0,
    },
    faqSection: {
        marginBottom: '48px',
    },
    faqList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    faqItem: {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        border: '1px solid var(--color-border, #E0E0E0)',
    },
    faqQuestion: {
        fontSize: '15px',
        fontWeight: '700',
        color: 'var(--color-text)',
        cursor: 'pointer',
        listStyle: 'none',
    },
    faqAnswer: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        lineHeight: 1.6,
        margin: '12px 0 0',
    },
    ctaSection: {
        textAlign: 'center',
        padding: '48px 20px',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-2xl)',
        marginBottom: '48px',
    },
    ctaTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: '0 0 12px',
    },
    ctaText: {
        fontSize: '15px',
        color: 'var(--color-text-muted)',
        margin: '0 0 24px',
        lineHeight: 1.6,
    },
    ctaBtn: {
        backgroundColor: '#FF6B35',
        color: '#FFF',
        border: 'none',
        borderRadius: '14px',
        padding: '16px 36px',
        fontSize: '16px',
        fontWeight: '800',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
    },
    internalLinks: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '24px',
        borderTop: '1px solid var(--color-border, #E0E0E0)',
    },
    internalLink: {
        color: 'var(--color-primary)',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '600',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border, #E0E0E0)',
    },
};

export default CategoryLandingPage;
