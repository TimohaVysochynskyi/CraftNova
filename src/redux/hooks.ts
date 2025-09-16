import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Auth selectors
export const useAuth = () => {
    return useAppSelector((state) => state.auth);
};

export const useUser = () => {
    return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
    return useAppSelector((state) => state.auth.isAuthenticated);
};

export const useAuthLoading = () => {
    return useAppSelector((state) => state.auth.isLoading);
};