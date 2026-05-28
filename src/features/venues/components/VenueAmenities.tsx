import React from 'react';
import { 
    Wifi, 
    Bath, 
    Bike, 
    ParkingCircle, 
    Crown, 
    ShieldCheck, 
    Camera, 
    Flame, 
    Briefcase, 
    Shirt, 
    Building2, 
    Wind, 
    ArrowUpDown, 
    Music, 
    Heater, 
    Theater, 
    Volume2, 
    Mic2, 
    Music4, 
    BatteryCharging, 
    Baby, 
    Trees, 
    Monitor, 
    Cigarette, 
    Wine, 
    UtensilsCrossed, 
    Coffee,
    Waves,
    Presentation,
    BriefcaseBusiness,
    Projector,
    Printer,
    Sofa,
    Map,
    PawPrint,
    Clock3,
    Store,
    Film,
    CreditCard,
    Wallet,
    Utensils,
    Leaf,
    Trophy,
    Flag,
    CheckCircle,
    Loader2,
    AlertCircle
} from 'lucide-react';
import type { VenueAmenities } from '../../../api/dto/venueDto';

interface VenueAmenitiesProps {
    amenities: VenueAmenities | null;
    isLoading?: boolean;
    isError?: boolean;
}

// Icon mapping for amenities
const amenityIcons: Record<string, React.ElementType> = {
    // Basic amenities
    "Wi-Fi": Wifi,
    "wi-fi": Wifi,
    "wifi": Wifi,
    "Уборная": Bath,
    "уборная": Bath,
    "Туалет": Bath,
    "туалет": Bath,
    "Доставка": Bike,
    "доставка": Bike,
    "Парковка": ParkingCircle,
    "парковка": ParkingCircle,
    "Паркинг": ParkingCircle,
    "паркинг": ParkingCircle,
    
    // VIP & Security
    "VIP кабины": Crown,
    "vip кабины": Crown,
    "VIP-залы": Crown,
    "vip-залы": Crown,
    "Охрана": ShieldCheck,
    "охрана": ShieldCheck,
    "Видеонаблюдение": Camera,
    "видеонаблюдение": Camera,
    "Пожаротушение": Flame,
    "пожаротушение": Flame,
    
    // Storage & Changing
    "Камера хранения": Briefcase,
    "камера хранения": Briefcase,
    "Раздевалка": Shirt,
    "раздевалка": Shirt,
    "Гардероб": Shirt,
    "гардероб": Shirt,
    
    // Religious & Comfort
    "Намазкана": Building2,
    "намазкана": Building2,
    "Молитвенная комната": Building2,
    "молитвенная комната": Building2,
    "Кондиционирование": Wind,
    "кондиционирование": Wind,
    "Кондиционер": Wind,
    "кондиционер": Wind,
    "Лифт": ArrowUpDown,
    "лифт": ArrowUpDown,
    "Отопление": Heater,
    "отопление": Heater,
    
    // Entertainment
    "Танцпол": Music,
    "танцпол": Music,
    "Сцена": Theater,
    "сцена": Theater,
    "Звуковая аппаратура": Volume2,
    "звуковая аппаратура": Volume2,
    "Караоке": Mic2,
    "караоке": Mic2,
    "Живая музыка": Music4,
    "живая музыка": Music4,
    "Музыка": Music4,
    "музыка": Music4,
    
    // Technology
    "Зарядка устройств": BatteryCharging,
    "зарядка устройств": BatteryCharging,
    "Монитор": Monitor,
    "монитор": Monitor,
    "Проектор и экран": Projector,
    "проектор и экран": Projector,
    "Печать и сканирование": Printer,
    "печать и сканирование": Printer,
    
    // Family & Outdoor
    "Детский стул": Baby,
    "детский стул": Baby,
    "Детская площадка": Baby,
    "детская площадка": Baby,
    "Терраса": Trees,
    "терраса": Trees,
    "Фотозона": Camera,
    "фотозона": Camera,
    "Зона для курения": Cigarette,
    "зона для курения": Cigarette,
    
    // Food & Drink
    "Бар": Wine,
    "бар": Wine,
    "Ресторан": UtensilsCrossed,
    "ресторан": UtensilsCrossed,
    "Кофейня": Coffee,
    "кофейня": Coffee,
    "Барбекю зона": Flame,
    "барбекю зона": Flame,
    "Шведский стол": Utensils,
    "шведский стол": Utensils,
    "Вегетарианское меню": Leaf,
    "вегетарианское меню": Leaf,
    "Бесплатный чай и кофе": Coffee,
    "бесплатный чай и кофе": Coffee,
    "Кальянная зона": Flame,
    "кальянная зона": Flame,
    
    // Sports & Recreation
    "Бассейн": Waves,
    "бассейн": Waves,
    "Теннисный корт": Trophy,
    "теннисный корт": Trophy,
    "Гольф-поле": Flag,
    "гольф-поле": Flag,
    "Аренда велосипедов": Bike,
    "аренда велосипедов": Bike,
    
    // Business & Work
    "Конференц-зал": Presentation,
    "конференц-зал": Presentation,
    "Коворкинг": BriefcaseBusiness,
    "коворкинг": BriefcaseBusiness,
    
    // Relaxation
    "Лаунж-зона": Sofa,
    "лаунж-зона": Sofa,
    "Лаунж": Sofa,
    "лаунж": Sofa,
    
    // Services
    "Экскурсии": Map,
    "экскурсии": Map,
    "Домашние животные разрешены": PawPrint,
    "домашние животные разрешены": PawPrint,
    "Можно с животными": PawPrint,
    "можно с животными": PawPrint,
    "Круглосуточная стойка регистрации": Clock3,
    "круглосуточная стойка регистрации": Clock3,
    "Ресепшн 24/7": Clock3,
    "ресепшн 24/7": Clock3,
    "Магазин на территории": Store,
    "магазин на территории": Store,
    "Кинотеатр": Film,
    "кинотеатр": Film,
    "Банкомат": CreditCard,
    "банкомат": CreditCard,
    "Терминал": Wallet,
    "терминал": Wallet,
};

// Default icon for amenities not in mapping
const DefaultIcon = CheckCircle;

// Helper to get icon for amenity
const getAmenityIcon = (name: string): React.ElementType => {
    const trimmedName = name.trim();
    return amenityIcons[trimmedName] || amenityIcons[trimmedName.toLowerCase()] || DefaultIcon;
};

const VenueAmenitiesSection: React.FC<VenueAmenitiesProps> = ({ amenities, isLoading, isError }) => {
    if (isLoading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Удобства и услуги</h2>
                <div style={styles.loadingState}>
                    <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                    <p style={styles.loadingText}>Загрузка удобств...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Удобства и услуги</h2>
                <div style={styles.errorState}>
                    <AlertCircle size={32} style={{ color: 'var(--color-error)' }} />
                    <p style={styles.errorText}>Не удалось загрузить удобства</p>
                </div>
            </div>
        );
    }

    if (!amenities) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Удобства и услуги</h2>
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>Удобства пока не добавлены</p>
                </div>
            </div>
        );
    }

    // Extract amenities from the object (filter out empty values)
    const amenitiesList = Object.values(amenities).filter(
        (amenity): amenity is string => Boolean(amenity && amenity.trim())
    );

    if (amenitiesList.length === 0) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Удобства и услуги</h2>
                <div style={styles.emptyState}>
                    <p style={styles.emptyText}>Удобства пока не добавлены</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Удобства и услуги</h2>
            <div style={styles.grid}>
                {amenitiesList.map((amenity, idx) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                        <div
                            key={idx}
                            style={styles.amenityCard}
                            className="card-hover"
                            aria-label={amenity}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                            }}
                        >
                            <div style={styles.iconWrapper}>
                                <IconComponent size={24} />
                            </div>
                            <span style={styles.amenityName}>{amenity}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-2xl)',
        marginBottom: '24px',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-sm)',
    },
    title: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '20px',
        color: 'var(--color-text)',
        letterSpacing: '-0.3px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
    },
    amenityCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '16px 12px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-light)',
        transition: 'all var(--transition-base)',
        cursor: 'default',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center',
        minHeight: '100px',
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-primary-alpha)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    amenityName: {
        fontSize: '13px',
        color: 'var(--color-text)',
        fontWeight: '600',
        lineHeight: '1.3',
        wordBreak: 'break-word',
    },
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '12px',
    },
    loadingText: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        fontWeight: '500',
        margin: 0,
    },
    errorState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '12px',
    },
    errorText: {
        fontSize: '14px',
        color: 'var(--color-error)',
        fontWeight: '600',
        margin: 0,
        textAlign: 'center',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    emptyText: {
        fontSize: '14px',
        color: 'var(--color-text-muted)',
        fontWeight: '500',
        margin: 0,
        textAlign: 'center',
    },
};

export default VenueAmenitiesSection;
