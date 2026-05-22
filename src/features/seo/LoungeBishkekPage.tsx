import React from 'react';
import CategoryLandingPage from './CategoryLandingPage';
import type { CategoryPageConfig } from './CategoryLandingPage';

const BASE = 'https://client.eelepkal.com';

const config: CategoryPageConfig = {
    slug: 'lounge-bishkek',
    categoryName: 'lounge',
    title: 'Lounge Бишкека — онлайн бронирование столиков',
    metaTitle: 'Lounge Бишкека — онлайн бронирование | Ээлеп кал',
    metaDescription:
        'Лучшие lounge и lounj-бары Бишкека с онлайн бронированием. Забронируйте VIP-место или приватную зону за 30 секунд. Меню, фото и отзывы на Ээлеп кал.',
    keywords:
        'lounge Бишкек, lounge бар Бишкек, бронирование lounge Бишкек, забронировать lounge Бишкек, lounj брондоо, VIP зона Бишкек, бронь lounge кафе Кыргызстан',
    canonical: `${BASE}/lounge-bishkek`,
    h1: 'Lounge заведения Бишкека — онлайн бронирование',
    h2: 'Lounge с онлайн бронью в Бишкеке',
    lead: 'Лучшие lounge и lounj-бары Бишкека для особых вечеров. Забронируйте приватную зону или VIP-место онлайн — без звонков, без ожидания.',
    sections: [
        {
            heading: 'Lounge заведения Бишкека на Ээлеп кал',
            body: 'Ээлеп кал — лучший способ забронировать lounge в Бишкеке онлайн. Просматривайте фотографии, узнавайте условия бронирования и резервируйте место за 30 секунд.',
        },
        {
            heading: 'VIP-зоны и приватные lounge в Бишкеке',
            body: 'Планируете день рождения, корпоратив или особый ужин? Многие lounge Бишкека предлагают приватные зоны и VIP-кабинки. Бронируйте через Ээлеп кал.',
        },
        {
            heading: 'Кальянные lounge Бишкека',
            body: 'В некоторых lounge Бишкека доступны кальяны и специальная атмосфера для расслабленного вечера. Уточняйте наличие услуг на странице заведения.',
        },
        {
            heading: 'Вечерний lounge в Бишкеке',
            body: 'Lounge заведения Бишкека идеально подходят для вечернего отдыха, бизнес-встреч и праздников. Ознакомьтесь с меню и режимом работы на Ээлеп кал.',
        },
    ],
    faq: [
        {
            question: 'Как забронировать lounge в Бишкеке?',
            answer: 'На Ээлеп кал выберите lounge из списка, откройте страницу заведения и перейдите в раздел «Бронирование». Выберите дату, время и количество гостей — готово.',
        },
        {
            question: 'Есть ли lounge с кальяном в Бишкеке?',
            answer: 'Да, некоторые lounge заведения Бишкека предлагают кальяны. Смотрите описание и услуги на странице заведения на Ээлеп кал.',
        },
        {
            question: 'Можно ли забронировать VIP-зону в lounge Бишкека?',
            answer: 'Многие lounge Бишкека предлагают VIP-зоны и приватные кабинки. Информация о типах столов и зон доступна в разделе бронирования каждого заведения.',
        },
    ],
    breadcrumbs: [
        { name: 'Главная', url: `${BASE}/` },
        { name: 'Lounge Бишкека', url: `${BASE}/lounge-bishkek` },
    ],
    schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Lounge Бишкека — онлайн бронирование',
        description: 'Лучшие lounge заведения Бишкека с онлайн бронированием на платформе Ээлеп кал',
        url: `${BASE}/lounge-bishkek`,
        inLanguage: 'ru',
        isPartOf: { '@type': 'WebSite', url: BASE, name: 'Ээлеп кал' },
    },
};

const LoungeBishkekPage: React.FC = () => <CategoryLandingPage config={config} />;
export default LoungeBishkekPage;
