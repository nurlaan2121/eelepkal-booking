import React, { useState, useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import BottomNavigation from '../components/Navigation/BottomNavigation';
import Footer from '../components/Footer/Footer';
import ImageModal from '../../components/ui/ImageModal';
import { useImageStore } from '../stores/imageStore';
import { ZoomIn } from 'lucide-react';

const MainLayout: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [lastClick, setLastClick] = useState({ time: 0, target: null as HTMLElement | null });

    const { openImage } = useImageStore();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                const now = Date.now();
                const timeDiff = now - lastClick.time;

                if (lastClick.target === target && timeDiff < 300) {
                    // Double click
                    const clickedImg = target as HTMLImageElement;

                    const parent = target.parentElement;
                    let galleryImages: string[] = [];
                    let initialIndex = 0;

                    if (parent) {
                        // 1. Try to find images in the nearest section or container with multiple images
                        let container = target.closest('section') || parent;
                        let allImgs = Array.from(container.querySelectorAll('img')) as HTMLImageElement[];

                        // 2. If we only found one image, try a wider search (go up one more level)
                        if (allImgs.length <= 1) {
                            const widerContainer = container.parentElement;
                            if (widerContainer) {
                                allImgs = Array.from(widerContainer.querySelectorAll('img')) as HTMLImageElement[];
                            }
                        }

                        // 3. Filter and Deduplicate
                        // Important: some images might have same SRC but different sizes/query params
                        // Also filter out very small icons (< 30px)
                        const uniqueSrcs = new Set<string>();
                        const filteredImgs: HTMLImageElement[] = [];

                        allImgs.forEach(img => {
                            if (img.naturalWidth > 0 && (img.naturalWidth < 30 || img.naturalHeight < 30)) return;
                            if (!uniqueSrcs.has(img.src)) {
                                uniqueSrcs.add(img.src);
                                filteredImgs.push(img);
                            }
                        });

                        galleryImages = filteredImgs.map(img => img.src);
                        initialIndex = filteredImgs.findIndex(img => img.src === clickedImg.src);
                    }

                    if (galleryImages.length === 0) {
                        galleryImages = [clickedImg.src];
                        initialIndex = 0;
                    }

                    openImage(initialIndex, galleryImages);
                    setShowHint(false);
                } else {
                    // Single click - show hint
                    setShowHint(true);
                    setTimeout(() => setShowHint(false), 2000);
                }
                setLastClick({ time: now, target });
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Using capture phase to ensure we catch clicks even if propagation is stopped
        window.addEventListener('click', handleClick, true);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClick, true);
        };
    }, [openImage, lastClick]);

    return (
        <div style={styles.container}>
            <ScrollRestoration />
            <ImageModal />
            <header style={{
                ...styles.header,
                boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
                borderBottomColor: scrolled ? 'transparent' : 'var(--color-border)'
            }}>
                <div style={styles.logoWrapper}>
                    <img src="/logo.png" alt="Ээлеп кал" style={{ height: 36, width: 36, objectFit: 'contain' }} />
                    <h1 style={styles.title}>Ээлеп кал</h1>
                </div>
            </header>

            <main style={styles.main}>
                <Outlet />
            </main>

            {showHint && (
                <div style={styles.hintToast} className="animate-fade-in">
                    <ZoomIn size={16} />
                    <span>Нажмите два раза для просмотра в полном размере</span>
                </div>
            )}

            <Footer />
            <BottomNavigation />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        paddingBottom: '65px', // Space for bottom nav
    },
    header: {
        padding: '12px 20px',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        transition: 'all var(--transition-base)',
        display: 'flex',
        alignItems: 'center',
    },
    logoWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    iconCircle: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-sm)',
    },
    title: {
        fontSize: '22px',
        fontWeight: '800',
        color: 'var(--color-text)',
        margin: 0,
        letterSpacing: '-0.5px',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg)',
    },
    hintToast: {
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#FFFFFF',
        padding: '10px 20px',
        borderRadius: 'var(--radius-full)',
        fontSize: '13px',
        fontWeight: '600',
        zIndex: 1500,
        pointerEvents: 'none',
        boxShadow: 'var(--shadow-lg)',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
};

export default MainLayout;
