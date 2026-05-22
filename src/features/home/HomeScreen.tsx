import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { venueService } from '../../api/services/venueService';
import VenueCard from './components/VenueCard';
import { ChevronRight, Search, Clock, CheckCircle } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';
import OptimizedImage from '../../components/ui/OptimizedImage';
import SEOManager from '../../shared/components/SEO/SEOManager';


const HomeScreen: React.FC = () => {
    const navigate = useNavigate();

    // Fetch all sections in parallel
    const [
        cuisinesQuery,
        recommendedQuery,
        openQuery,
        ratingQuery
    ] = useQueries({
        queries: [
            { queryKey: ['cuisines'], queryFn: () => venueService.getAllCuisines() },
            { queryKey: ['recommended'], queryFn: () => venueService.getRecommendedVenues() },
            { queryKey: ['open'], queryFn: () => venueService.getOpenVenues() },
            { queryKey: ['rating'], queryFn: () => venueService.getTopRatedVenues() },
        ]
    });

    const isLoadingCategories = cuisinesQuery.isLoading;

    return (
        <div style={styles.container}>
            <SEOManager
                title="Онлайн бронирование столиков в Кыргызстане"
                description="Ээлеп кал — онлайн бронирование столиков в ресторанах, кафе, чайханах и lounge Бишкека без звонков. Лучшие заведения Кыргызстана."
                keywords="онлайн бронь столика, бронирование ресторана Бишкек, забронировать столик Бишкек, кафе Бишкек, чайхана Бишкек, lounge Бишкек, Ээлеп кал, eelepkal, рестораны Кыргызстан, столик брондоо"
                canonical="https://client.eelepkal.com/"
                schema={[
                    {
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'Ээлеп кал',
                        url: 'https://client.eelepkal.com/',
                        description: 'Онлайн бронирование столиков в ресторанах, кафе, чайханах и lounge Кыргызстана',
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: { '@type': 'EntryPoint', urlTemplate: 'https://client.eelepkal.com/search?q={search_term_string}' },
                            'query-input': 'required name=search_term_string'
                        }
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: 'Как забронировать столик в ресторане Бишкека онлайн?',
                                acceptedAnswer: { '@type': 'Answer', text: 'На Ээлеп кал выберите заведение, откройте его страницу, перейдите во вкладку «Бронирование» и выберите дату, время и количество гостей. Столик будет зарезервирован мгновенно.' },
                            },
                            {
                                '@type': 'Question',
                                name: 'Бесплатно ли бронирование на Ээлеп кал?',
                                acceptedAnswer: { '@type': 'Answer', text: 'Да, платформа Ээлеп кал бесплатна для гостей. Бронируйте столики в любых заведениях без дополнительных расходов.' },
                            },
                            {
                                '@type': 'Question',
                                name: 'В каких заведениях Бишкека можно забронировать столик?',
                                acceptedAnswer: { '@type': 'Answer', text: 'Ээлеп кал предлагает бронирование в ресторанах, кафе, чайханах, lounge и заведениях с кабинками Бишкека.' },
                            },
                            {
                                '@type': 'Question',
                                name: 'Можно ли отменить бронь?',
                                acceptedAnswer: { '@type': 'Answer', text: 'Условия отмены зависят от конкретного заведения. Информация об отмене указана на странице каждого заведения в разделе «Условия бронирования».' },
                            },
                            {
                                '@type': 'Question',
                                name: 'Что значит «Ээлеп кал»?',
                                acceptedAnswer: { '@type': 'Answer', text: '«Ээлеп кал» — это кыргызское выражение, означающее «займи место». Наша миссия — сделать онлайн-бронирование доступным для всех жителей Кыргызстана.' },
                            },
                        ],
                    },
                ]}
            />
            {/* Hero Section */}

            <section style={styles.heroSection}>
                <div style={styles.heroOverlay} />
                <div style={styles.heroContent}>
                    <span style={styles.heroBadge}>Ээлеп кал — №1 в Кыргызстане</span>
                    <h1 style={styles.heroTitle}>Онлайн бронирование<br />столиков в Кыргызстане</h1>
                    <p style={styles.heroSubtitle}>Бронируйте столики в ресторанах, кафе, чайханах и lounge Бишкека без звонков — за 30 секунд.</p>
                    <div style={styles.heroActions}>
                        <button className="btn-primary" onClick={() => navigate('/search')}>
                            Забронировать столик
                            <ChevronRight size={18} />
                        </button>
                        <button
                            className="btn-secondary"
                            style={{
                                backgroundColor: 'transparent',
                                border: '1px solid #FFF',
                                color: '#FFF'
                            }}
                            onClick={() => navigate('/search')}
                        >
                            Все заведения
                        </button>

                        <button
                            className="btn-primary"
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: 'none'
                            }}
                            onClick={() => window.open('https://site.eelepkal.com/', '_blank', 'noopener,noreferrer')}
                        >
                            Узнать больше
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section style={styles.stepsSection}>
                <h2 style={styles.stepsHeader}>Как это работает</h2>
                <div style={styles.stepsContainer}>
                    <div style={styles.stepCard}>
                        <div style={styles.stepIconWrapper}><Search size={24} color="#FF6B35" /></div>
                        <span style={styles.stepTitle}>Найдите заведение</span>
                        <span style={styles.stepDesc}>Поиск по кухне и рейтингу</span>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepIconWrapper}><Clock size={24} color="#FF6B35" /></div>
                        <span style={styles.stepTitle}>Выберите время</span>
                        <span style={styles.stepDesc}>Удобные слоты бронирования</span>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepIconWrapper}><CheckCircle size={24} color="#FF6B35" /></div>
                        <span style={styles.stepTitle}>Забронируйте</span>
                        <span style={styles.stepDesc}>100% гарантия столика</span>
                    </div>
                </div>
            </section>

            {/* Cuisines Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Категории</h2>
                </div>
                {isLoadingCategories ? (
                    <div style={styles.horizontalScroll} className="hide-scrollbar">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} width="100px" height="100px" borderRadius="var(--radius-lg)" />
                        ))}
                    </div>
                ) : cuisinesQuery.isError ? (
                    <div style={{ padding: '0 20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        Не удалось загрузить категории
                    </div>
                ) : Array.isArray(cuisinesQuery.data) && cuisinesQuery.data.length > 0 ? (
                    <div style={styles.horizontalScroll} className="hide-scrollbar">
                        {cuisinesQuery.data.map((cuisine) => (
                            <div
                                key={cuisine.id}
                                style={styles.cuisineItem}
                                className="card-hover"
                                onClick={() => navigate(`/search?cuisine=${encodeURIComponent(cuisine.name)}`)}
                            >
                                <div style={styles.cuisineIconWrapper}>
                                    <OptimizedImage
                                        src={cuisine.imageUrl}
                                        alt={cuisine.name}
                                        style={styles.cuisineImage}
                                    />
                                </div>
                                <span style={styles.cuisineLabel}>{cuisine.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '0 20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                        Категории не найдены
                    </div>
                )}
            </section>


            {/* Recommended Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Рекомендуем</h2>
                    <button style={styles.seeAllBtn} onClick={() => navigate('/search')}>
                        Все <ChevronRight size={16} />
                    </button>
                </div>
                <div style={styles.horizontalScroll} className="hide-scrollbar">
                    {recommendedQuery.isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ minWidth: 240, height: 260, borderRadius: 16 }} />)
                    ) : Array.isArray(recommendedQuery.data) ? (
                        recommendedQuery.data.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))
                    ) : (
                        <div style={{ color: 'var(--color-text-muted)', padding: '20px' }}>Нет данных</div>
                    )}
                </div>
            </section>

            {/* Top Rated Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Самые популярные</h2>
                    <button style={styles.seeAllBtn} onClick={() => navigate('/search')}>
                        Все <ChevronRight size={16} />
                    </button>
                </div>
                <div style={styles.horizontalScroll} className="hide-scrollbar">
                    {ratingQuery.isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ minWidth: 240, height: 260, borderRadius: 16 }} />)
                    ) : Array.isArray(ratingQuery.data) ? (
                        ratingQuery.data.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))
                    ) : (
                        <div style={{ color: 'var(--color-text-muted)', padding: '20px' }}>Нет данных</div>
                    )}
                </div>
            </section>

            {/* Open Now Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title">Сейчас открыты</h2>
                    <button style={styles.seeAllBtn} onClick={() => navigate('/search')}>
                        Все <ChevronRight size={16} />
                    </button>
                </div>
                <div style={styles.horizontalScroll} className="hide-scrollbar">
                    {openQuery.isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ minWidth: 240, height: 260, borderRadius: 16 }} />)
                    ) : Array.isArray(openQuery.data) ? (
                        openQuery.data.map((venue) => (
                            <VenueCard key={venue.venueId} venue={venue} />
                        ))
                    ) : (
                        <div style={{ color: 'var(--color-text-muted)', padding: '20px' }}>Нет данных</div>
                    )}
                </div>
            </section>

            {/* SEO Content Section */}
            <section style={styles.seoSection} aria-label="Информация о сервисе">
                <h2 style={styles.seoH2}>Онлайн бронирование ресторанов и кафе Бишкека</h2>
                <div style={styles.seoGrid}>
                    <div>
                        <h3 style={styles.seoH3}>Где забронировать столик в Бишкеке онлайн?</h3>
                        <p style={styles.seoP}>
                            Ээлеп кал — первая платформа онлайн бронирования столиков в ресторанах, кафе, чайханах и lounge Кыргызстана.
                            Больше не нужно звонить и ждать ответа: выберите заведение, дату, время и количество гостей — столик будет зарезервирован
                            за 30 секунд. Сервис работает круглосуточно, 7 дней в неделю.
                        </p>
                        <h3 style={styles.seoH3}>Рестораны Бишкека с онлайн бронью</h3>
                        <p style={styles.seoP}>
                            В каталоге Ээлеп кал представлены лучшие рестораны Бишкека с разнообразной кухней: восточная, европейская, кыргызская, итальянская.
                            Каждое заведение проверено командой платформы. Вы можете посмотреть фото, меню, рейтинг, часы работы и условия бронирования
                            прямо на странице заведения.
                        </p>
                        <h3 style={styles.seoH3}>Чайханы и кафе Бишкека онлайн</h3>
                        <p style={styles.seoP}>
                            Ищете чайхану в Бишкеке или уютное кафе на компанию? На Ээлеп кал собраны лучшие чайханы, кафе и lounge заведения города.
                            Фильтруйте по кухне, рейтингу и типу заведения — найдите идеальное место для деловой встречи, романтического ужина
                            или семейного обеда.
                        </p>
                    </div>
                    <div>
                        <h3 style={styles.seoH3}>Как работает бронирование?</h3>
                        <p style={styles.seoP}>
                            Бронирование на Ээлеп кал максимально простое. Найдите заведение, которое вам нравится, откройте его страницу
                            и перейдите во вкладку «Бронирование». Выберите дату, время, этаж и количество гостей — система покажет доступные столики.
                            После подтверждения заведение получит уведомление, а вы — гарантированный столик.
                        </p>
                        <h3 style={styles.seoH3}>Бронирование кабинок и lounge в Бишкеке</h3>
                        <p style={styles.seoP}>
                            На платформе Ээлеп кал можно забронировать не только обычный столик, но и отдельную кабинку или VIP-lounge зону.
                            Идеально для корпоративов, дней рождения или приватных встреч. Уточните наличие кабинок прямо на странице заведения.
                        </p>
                        <h3 style={styles.seoH3}>Ээлеп кал — кыргызча</h3>
                        <p style={styles.seoP}>
                            «Ээлеп кал» — кыргызское выражение, означающее «займи место». Наша миссия — сделать онлайн-бронирование столиков
                            доступным для всех жителей Кыргызстана. Платформа работает на русском языке и поддерживает кыргызский интерфейс.
                            Столик брондоо, онлайн брондоо, ресторан брондоо — теперь это просто.
                        </p>
                    </div>
                </div>
                <div style={styles.seoLinks}>
                    <a href="/restaurants-bishkek" style={styles.seoLink}>Рестораны Бишкека</a>
                    <a href="/cafe-bishkek" style={styles.seoLink}>Кафе Бишкека</a>
                    <a href="/chayhana-bishkek" style={styles.seoLink}>Чайханы Бишкека</a>
                    <a href="/lounge-bishkek" style={styles.seoLink}>Lounge Бишкека</a>
                </div>
            </section>
            <div style={{ height: 40 }} />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        backgroundColor: 'var(--color-bg)',
    },
    heroSection: {
        position: 'relative',
        minHeight: '380px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        margin: '16px 20px 0',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        // Mocking the background image URL since it's hardcoded for now, real implementation would fetch it or use the generated path 
        backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    heroOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
    },
    heroBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '700',
        border: '1px solid rgba(255,255,255,0.2)',
    },
    heroTitle: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#FFFFFF',
        margin: 0,
        lineHeight: 1.1,
        letterSpacing: '-0.5px',
    },
    heroSubtitle: {
        fontSize: '15px',
        color: 'rgba(255,255,255,0.85)',
        margin: 0,
        lineHeight: 1.5,
    },
    heroActions: {
        marginTop: '8px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    stepsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '0 20px',
    },
    stepsHeader: {
        fontSize: '18px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: 0,
        letterSpacing: '-0.3px',
    },
    stepsContainer: {
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    stepCard: {
        minWidth: '140px',
        backgroundColor: 'var(--color-surface)',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    stepIconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '4px',
    },
    stepTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: 'var(--color-text)',
    },
    stepDesc: {
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        lineHeight: 1.4,
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    sectionHeader: {
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    seeAllBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        color: 'var(--color-primary)',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        padding: 0,
    },
    cuisinesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        padding: '0 20px',
        gap: '16px',
    },
    cuisineItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: 'var(--color-surface)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        minWidth: '110px',
        flexShrink: 0,
        scrollSnapAlign: 'start',
    },
    cuisineIconWrapper: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
    },
    cuisineImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    cuisineLabel: {
        fontSize: '12px',
        fontWeight: '700',
        color: 'var(--color-text)',
        textAlign: 'center',
    },
    horizontalScroll: {
        display: 'flex',
        overflowX: 'auto',
        padding: '4px 20px 20px', // Extra top padding for hover shadow clipping
        gap: '16px',
        scrollSnapType: 'x mandatory',
    },
};

export default HomeScreen;
