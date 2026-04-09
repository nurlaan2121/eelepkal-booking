import React from 'react';
import { Landmark, QrCode } from 'lucide-react';
import type { VenuePaymentDetails } from '../../../api/dto/venueDto';

interface VenuePaymentsProps {
    payments: VenuePaymentDetails[];
}

const VenuePayments: React.FC<VenuePaymentsProps> = ({ payments }) => {
    if (!payments || payments.length === 0) return null;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Способы оплаты</h2>
            <div style={styles.list}>
                {payments.map((payment) => (
                    <div key={payment.id} style={styles.card}>
                        <div style={styles.iconBox}>
                            <Landmark size={24} color="#FF9800" />
                        </div>
                        <div style={styles.info}>
                            <span style={styles.bankName}>{payment.bankName || 'Банковский перевод'}</span>
                            <span style={styles.account}>{payment.bankAccountNumber || 'Реквизиты не указаны'}</span>
                            {payment.taxIdentificationNumber && (
                                <span style={styles.tin}>ИНН: {payment.taxIdentificationNumber}</span>
                            )}
                        </div>
                        {payment.qrcodeUrl && (
                            <div style={styles.qrIcon}>
                                <QrCode size={30} color="#FF9800" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '24px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        marginBottom: '24px',
        border: '1px solid #F0F0F0',
    },
    title: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '16px',
        color: '#000',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#F9F9F9',
        borderRadius: '20px',
    },
    iconBox: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        backgroundColor: '#FFE0B2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    bankName: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#212121',
    },
    account: {
        fontSize: '14px',
        color: '#757575',
    },
    tin: {
        fontSize: '12px',
        color: '#9E9E9E',
        marginTop: '2px',
    },
    qrIcon: {
        padding: '8px',
        backgroundColor: '#FFF',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
};

export default VenuePayments;
