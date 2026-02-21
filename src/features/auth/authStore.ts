import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    userId: number;
    email: string;
    role?: string;
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (token: string, user: User) => void;
    setAccessToken: (token: string) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null, // User requested in-memory storage, but for persistence we might need a refresh flow
            user: null,
            isAuthenticated: false,
            isLoading: false,

            setAuth: (token, user) => set({
                accessToken: token,
                user,
                isAuthenticated: true
            }),

            setAccessToken: (token) => set({ accessToken: token }),

            setLoading: (loading) => set({ isLoading: loading }),

            logout: () => {
                // Clear tokens from storage if any
                localStorage.removeItem('refreshToken');
                set({ accessToken: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'elevauto-auth-storage',
            // Only persist user data. isAuthenticated will be false on refresh 
            // because accessToken is not persisted.
            partialize: (state) => ({ user: state.user }),
            storage: createJSONStorage(() => localStorage),
        }
    )
);
