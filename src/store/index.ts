import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import chatsReducer from './chatsSlice';
import messagesReducer from './messagesSlice';
import uiReducer from './uiSlice';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  chats: chatsReducer,
  messages: messagesReducer,
  ui: uiReducer,
  auth: authReducer,
});

const persistConfig = {
  key: 'ai-chat-root',
  storage,
  whitelist: ['chats', 'messages', 'auth'], // Persist chats, messages, and auth state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
