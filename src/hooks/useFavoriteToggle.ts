import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venueService } from '../api/services/venueService';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useToastStore } from '../store/useToastStore';

interface UseFavoriteToggleProps {
    id: number;
    type: 'venue' | 'menu';
    initialIsFavorite?: boolean;
}

export const useFavoriteToggle = ({ id, type, initialIsFavorite = false }: UseFavoriteToggleProps) => {
    const queryClient = useQueryClient();
    const store = useFavoritesStore();
    const addToast = useToastStore((state) => state.addToast);

    const storeFavorite = type === 'venue' ? store.venueFavorites[id] : store.menuFavorites[id];
    const isFavourite = storeFavorite ?? initialIsFavorite;

    const [isLoadingFavourite, setIsLoadingFavourite] = useState(false);

    const mutation = useMutation({
        mutationFn: async (_newIsFavorite: boolean) => {
            if (type === 'venue') {
                return await venueService.toggleVenueFavourite(id);
            } else {
                return await venueService.toggleMenuFavourite(id);
            }
        },
        onMutate: async (newIsFavorite) => {
            setIsLoadingFavourite(true);
            if (type === 'venue') {
                store.setVenueFavorite(id, newIsFavorite);
            } else {
                store.setMenuFavorite(id, newIsFavorite);
            }
            return { previousIsFavorite: isFavourite };
        },
        onError: (_err, _newIsFavorite, context) => {
            if (context?.previousIsFavorite !== undefined) {
                if (type === 'venue') {
                    store.setVenueFavorite(id, context.previousIsFavorite);
                } else {
                    store.setMenuFavorite(id, context.previousIsFavorite);
                }
            }
            setIsLoadingFavourite(false);
            addToast("Ошибка, попробуйте снова", 'error');
        },
        onSuccess: (data) => {
            setIsLoadingFavourite(false);
            addToast(data.message || (isFavourite ? "Удалено из избранного" : "Добавлено в избранное"));

            // Invalidate queries so that next navigation shows accurate backend data
            if (type === 'venue') {
                queryClient.invalidateQueries({ queryKey: ['favoriteVenues'] });
                queryClient.invalidateQueries({ queryKey: ['venueSearch'] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['favoriteMenus'] });
                queryClient.invalidateQueries({ queryKey: ['venueDetails'] });
            }
        }
    });

    const toggle = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isLoadingFavourite) return;
        mutation.mutate(!isFavourite);
    };

    return { isFavourite, isLoadingFavourite, toggle };
};
