import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.iconWrapper}>
                            <AlertTriangle size={48} color="#FF5252" />
                        </div>
                        <h1 style={styles.title}>Что-то пошло не так</h1>
                        <p style={styles.message}>
                            Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
                        </p>
                        {this.state.error && (
                            <div style={styles.errorDetails}>
                                <code>{this.state.error.message}</code>
                            </div>
                        )}
                        <div style={styles.actions}>
                            <button style={styles.retryButton} onClick={this.handleReset}>
                                <RefreshCcw size={18} />
                                Попробовать снова
                            </button>
                            <button style={styles.homeButton} onClick={this.handleGoHome}>
                                <Home size={18} />
                                На главную
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        backgroundColor: '#F8F9FA',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    card: {
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    iconWrapper: {
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        backgroundColor: '#FFEBEE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#212121',
        margin: '0 0 12px 0',
        letterSpacing: '-0.5px',
    },
    message: {
        fontSize: '16px',
        color: '#616161',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
    },
    errorDetails: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#F5F5F5',
        borderRadius: '12px',
        marginBottom: '32px',
        textAlign: 'left',
        overflowX: 'auto',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
    },
    retryButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '14px 24px',
        borderRadius: '14px',
        border: 'none',
        backgroundColor: '#FF9800',
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'transform 0.2s, background-color 0.2s',
    },
    homeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '14px 24px',
        borderRadius: '14px',
        border: '1px solid #E0E0E0',
        backgroundColor: 'transparent',
        color: '#424242',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};

export default ErrorBoundary;
