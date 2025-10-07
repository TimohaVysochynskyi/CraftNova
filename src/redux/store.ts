import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import applicationReducer from './slices/applicationSlice';
import adminReducer from './slices/adminSlice';

// Root reducer
const rootReducer = combineReducers({
    auth: authReducer,
    application: applicationReducer,
    admin: adminReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'], // Only persist auth slice (application не потрібно persist)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
