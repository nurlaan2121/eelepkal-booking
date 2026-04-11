import React, { useEffect, useState } from 'react';
import { profileService } from '../../api/services/profileService';
import { ProfileResponse } from '../../api/dto/profile';
import './ProfileScreen.css';
import { useAuthStore } from '../auth/authStore';

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuthStore();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Не удалось загрузить профиль');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatDate = (dateArray: [number, number, number] | null) => {
        if (!dateArray) return 'Не указано';
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const translateGender = (gender: string | null) => {
        if (!gender) return 'Не указано';
        switch (gender) {
            case 'MALE': return 'Мужской';
            case 'FEMALE': return 'Женский';
            case 'OTHER': return 'Другой';
            default: return gender;
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-header">
                    <div className="avatar-container skeleton" style={{ background: '#f3f4f6' }}></div>
                    <div className="skeleton" style={{ width: '150px', height: '24px', borderRadius: '4px', marginTop: '16px' }}></div>
                    <div className="skeleton" style={{ width: '200px', height: '16px', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
                <div className="info-cards-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="info-card skeleton" style={{ height: '88px', background: '#f3f4f6', border: 'none' }}></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <p style={{ color: '#ef4444' }}>{error}</p>
                <button onClick={() => window.location.reload()} className="logout-button" style={{ background: '#f3f4f6', color: '#374151', width: 'auto', padding: '12px 24px' }}>
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="avatar-container">
                    {profile?.imageUrl ? (
                        <img src={profile.imageUrl} alt={profile.name} className="profile-image" />
                    ) : (
                        <div className="avatar-placeholder">
                            {profile?.name?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>
                <h2 className="profile-name">{profile?.name}</h2>
                <div className="profile-email-badge">{profile?.email}</div>
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <div className="info-icon-box icon-phone">📞</div>
                    <div className="info-content">
                        <span className="info-label">Телефон</span>
                        <span className="info-value">{profile?.phoneNumber || 'Не привязан'}</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon-box icon-email">✉️</div>
                    <div className="info-content">
                        <span className="info-label">Email</span>
                        <span className="info-value">{profile?.email}</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon-box icon-birthday">🎂</div>
                    <div className="info-content">
                        <span className="info-label">Дата рождения</span>
                        <span className="info-value">{formatDate(profile?.dateOfBirth || null)}</span>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon-box icon-gender">👤</div>
                    <div className="info-content">
                        <span className="info-label">Пол</span>
                        <span className="info-value">{translateGender(profile?.gender || null)}</span>
                    </div>
                </div>
            </div>

            <button className="logout-button" onClick={() => logout()}>
                Выйти из аккаунта
            </button>
        </div>
    );
};

export default ProfileScreen;
