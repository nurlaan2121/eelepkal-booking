import React, { useEffect, useState, useRef } from 'react';
import { profileService } from '../../api/services/profileService';
import { ProfileResponse, ProfileUpdateRequest } from '../../api/dto/profile';
import './ProfileScreen.css';
import { useAuthStore } from '../auth/authStore';
import { X, Save, Loader2, CheckCircle2, AlertCircle, Upload, User } from 'lucide-react';

const ProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null | undefined>(null);
    const { logout } = useAuthStore();

    // Form state
    const [formData, setFormData] = useState<ProfileUpdateRequest>({});
    
    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const openEditModal = () => {
        if (!profile) return;
        
        // Convert dateOfBirth array to YYYY-MM-DD string
        const dateOfBirthString = profile.dateOfBirth
            ? `${profile.dateOfBirth[0]}-${String(profile.dateOfBirth[1]).padStart(2, '0')}-${String(profile.dateOfBirth[2]).padStart(2, '0')}`
            : undefined;

        // Save original imageUrl to detect changes
        setOriginalImageUrl(profile.imageUrl);

        setFormData({
            imageUrl: profile.imageUrl || undefined,
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber || undefined,
            dateOfBirth: dateOfBirthString,
            gender: profile.gender || undefined,
        });
        setSaveSuccess(false);
        setSaveError(null);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
        setSaveError(null);
        setOriginalImageUrl(null);
    };

    const handleInputChange = (field: keyof ProfileUpdateRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Пожалуйста, выберите изображение');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Размер файла не должен превышать 5MB');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const response = await profileService.uploadProfilePhoto(file);
            setFormData(prev => ({
                ...prev,
                imageUrl: response.url,
            }));
        } catch (err: any) {
            console.error('Failed to upload photo:', err);
            setUploadError(err.response?.data?.message || 'Не удалось загрузить фото');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        logout();
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirm(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            // Build update data object
            const updateData: ProfileUpdateRequest = {};
            
            // Always include required fields
            if (formData.name && formData.name.trim()) {
                updateData.name = formData.name;
            }
            if (formData.email && formData.email.trim()) {
                updateData.email = formData.email;
            }
            
            // Include optional fields if they have values
            if (formData.phoneNumber && formData.phoneNumber.trim()) {
                updateData.phoneNumber = formData.phoneNumber;
            }
            if (formData.dateOfBirth && formData.dateOfBirth.trim()) {
                updateData.dateOfBirth = formData.dateOfBirth;
            }
            if (formData.gender) {
                updateData.gender = formData.gender;
            }
            
            // Smart imageUrl update - only include if it actually changed
            const imageUrlChanged = formData.imageUrl !== originalImageUrl;
            if (imageUrlChanged) {
                updateData.imageUrl = formData.imageUrl || '';
                console.log('✅ Image URL changed:', {
                    original: originalImageUrl,
                    new: formData.imageUrl,
                    willSend: updateData.imageUrl
                });
            } else {
                console.log('⏭️ Image URL not changed, skipping');
            }

            console.log('Sending profile update:', JSON.stringify(updateData, null, 2));

            const updatedProfile = await profileService.updateProfile(updateData);
            setProfile(updatedProfile);
            setSaveSuccess(true);
            
            // Close modal after 1.5 seconds
            setTimeout(() => {
                closeEditModal();
            }, 1500);
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            setSaveError(err.response?.data?.message || 'Не удалось обновить профиль');
        } finally {
            setIsSaving(false);
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
                <button className="edit-profile-button" onClick={openEditModal}>
                    Редактировать профиль
                </button>
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

            <button className="logout-button" onClick={handleLogoutClick}>
                Выйти из аккаунта
            </button>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div style={styles.modalOverlay} onClick={closeEditModal}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Редактировать профиль</h2>
                            <button onClick={closeEditModal} style={styles.closeButton}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Success Message */}
                        {saveSuccess && (
                            <div style={styles.successMessage}>
                                <CheckCircle2 size={20} color="#22c55e" />
                                <span>Профиль успешно обновлен!</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {saveError && (
                            <div style={styles.errorMessage}>
                                <AlertCircle size={20} color="#ef4444" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        {/* Form */}
                        <div style={styles.form}>
                            {/* Photo Upload */}
                            <div style={styles.photoUploadSection}>
                                <label style={styles.label}>Фото профиля</label>
                                <div style={styles.photoUploadContainer}>
                                    <div style={styles.photoPreview}>
                                        {isUploading ? (
                                            <div style={styles.photoPreviewLoading}>
                                                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#FF9800' }} />
                                                <span style={styles.photoPreviewText}>Загрузка...</span>
                                            </div>
                                        ) : formData.imageUrl ? (
                                            <>
                                                <img src={formData.imageUrl} alt="Profile" style={styles.photoPreviewImage} />
                                                <div style={styles.photoSuccessBadge}>
                                                    <CheckCircle2 size={16} color="#22c55e" />
                                                </div>
                                            </>
                                        ) : (
                                            <User size={48} color="#9ca3af" />
                                        )}
                                    </div>
                                    <div style={styles.photoUploadButtons}>
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            disabled={isUploading}
                                            style={styles.uploadButton}
                                        >
                                            <Upload size={16} />
                                            {isUploading ? 'Загрузка...' : 'Загрузить фото'}
                                        </button>
                                        {formData.imageUrl && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: undefined }))}
                                                disabled={isUploading}
                                                style={styles.removeButton}
                                            >
                                                Удалить
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: 'none' }}
                                />
                                {uploadError && (
                                    <div style={styles.uploadError}>
                                        <AlertCircle size={14} color="#ef4444" />
                                        <span>{uploadError}</span>
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Имя *</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    style={styles.input}
                                    placeholder="Введите имя"
                                />
                            </div>

                            {/* Email */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    style={styles.input}
                                    placeholder="example@mail.com"
                                />
                            </div>

                            {/* Phone */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Телефон</label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber || ''}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    style={styles.input}
                                    placeholder="+996 XXX XXX XXX"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Дата рождения</label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth || ''}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    style={styles.input}
                                    min="1940-01-01"
                                    max="2010-12-31"
                                    placeholder="Выберите дату"
                                />
                            </div>

                            {/* Gender */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Пол</label>
                                <select
                                    value={formData.gender || ''}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="">Не указано</option>
                                    <option value="MALE">Мужской</option>
                                    <option value="FEMALE">Женский</option>
                                    <option value="OTHER">Другой</option>
                                </select>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div style={styles.modalFooter}>
                            <button
                                onClick={closeEditModal}
                                style={styles.cancelButton}
                                disabled={isSaving}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSave}
                                style={{
                                    ...styles.saveButton,
                                    opacity: isSaving ? 0.7 : 1,
                                }}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        Сохранение...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Сохранить
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div style={styles.modalOverlay} onClick={handleLogoutCancel}>
                    <div style={styles.confirmModal} onClick={e => e.stopPropagation()}>
                        <div style={styles.confirmIcon}>
                            <AlertCircle size={48} color="#ef4444" />
                        </div>
                        <h3 style={styles.confirmTitle}>Выйти из аккаунта?</h3>
                        <p style={styles.confirmMessage}>
                            Вы действительно хотите выйти? Вам придется снова войти в систему, чтобы получить доступ к своим данным.
                        </p>
                        <div style={styles.confirmButtons}>
                            <button
                                onClick={handleLogoutCancel}
                                style={styles.confirmCancelButton}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleLogoutConfirm}
                                style={styles.confirmLogoutButton}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileScreen;

// Modal Styles
const styles: { [key: string]: React.CSSProperties } = {
    modalOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '20px',
        backdropFilter: 'blur(4px)',
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        borderBottom: '1px solid #f0f0f0',
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    closeButton: {
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        transition: 'all 0.2s',
    },
    successMessage: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        backgroundColor: '#f0fdf4',
        borderBottom: '1px solid #bbf7d0',
        color: '#166534',
        fontSize: '14px',
        fontWeight: '600',
    },
    errorMessage: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        backgroundColor: '#fef2f2',
        borderBottom: '1px solid #fecaca',
        color: '#991b1b',
        fontSize: '14px',
        fontWeight: '600',
    },
    form: {
        padding: '24px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
    },
    photoUploadSection: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
    },
    photoUploadContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    photoPreview: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative' as const,
        border: '3px solid #e5e7eb',
        flexShrink: 0,
    },
    photoPreviewLoading: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: '#ffffff',
    },
    photoPreviewText: {
        fontSize: '11px',
        fontWeight: '600',
        color: '#FF9800',
    },
    photoPreviewImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
    },
    photoSuccessBadge: {
        position: 'absolute' as const,
        bottom: '2px',
        right: '2px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #22c55e',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    photoUploadOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoUploadButtons: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
        flex: 1,
    },
    uploadButton: {
        padding: '10px 16px',
        backgroundColor: '#FF9800',
        color: '#ffffff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
    },
    removeButton: {
        padding: '8px 16px',
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        border: 'none',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
    },
    uploadError: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        color: '#991b1b',
        fontSize: '12px',
        fontWeight: '500',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    input: {
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '14px',
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: '#fafafa',
    },
    select: {
        padding: '12px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '14px',
        fontFamily: 'inherit',
        outline: 'none',
        backgroundColor: '#fafafa',
        cursor: 'pointer',
    },
    modalFooter: {
        display: 'flex',
        gap: '12px',
        padding: '24px',
        borderTop: '1px solid #f0f0f0',
    },
    cancelButton: {
        flex: 1,
        padding: '12px 24px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    saveButton: {
        flex: 1,
        padding: '12px 24px',
        backgroundColor: '#FF9800',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s',
    },
    confirmModal: {
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        padding: '32px 24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        textAlign: 'center' as const,
    },
    confirmIcon: {
        marginBottom: '16px',
    },
    confirmTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 12px 0',
    },
    confirmMessage: {
        fontSize: '14px',
        color: '#6b7280',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
    },
    confirmButtons: {
        display: 'flex',
        gap: '12px',
    },
    confirmCancelButton: {
        flex: 1,
        padding: '12px 24px',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
    },
    confirmLogoutButton: {
        flex: 1,
        padding: '12px 24px',
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
    },
};
