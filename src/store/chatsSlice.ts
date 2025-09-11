import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatsState } from '../types';
import { generateId } from '../utils/generateId';
import { loginSuccess, logoutAction } from './authSlice';
import dayjs from 'dayjs';

const initialState: ChatsState = {
  byId: {},
  allIds: [],
  currentChatId: null,
  showEmptyState: true,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    createChat: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; title: string }>
      ) => {
        const { id, title } = action.payload;
        const now = dayjs().toISOString();
        const chat: Chat = {
          id,
          title,
          messageIds: [],
          createdAt: now,
          updatedAt: now,
        };

        state.byId[id] = chat;
        state.allIds.unshift(id); // Add to beginning for recent-first order
        state.currentChatId = id;
        state.showEmptyState = false;
      },
      prepare: (title?: string) => {
        const id = generateId();
        return {
          payload: { id, title: title || 'New Chat' },
        };
      },
    },

    deleteChat: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;

      // Remove the chat
      delete state.byId[chatId];
      state.allIds = state.allIds.filter((id) => id !== chatId);

      // If we deleted the current chat, clear current chat selection
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }

      // If no chats left, show empty state
      if (state.allIds.length === 0) {
        state.showEmptyState = true;
      }
    },

    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },

    setChatTitle: (
      state,
      action: PayloadAction<{ chatId: string; title: string }>
    ) => {
      const { chatId, title } = action.payload;
      if (state.byId[chatId]) {
        state.byId[chatId].title = title;
        state.byId[chatId].updatedAt = dayjs().toISOString();
      }
    },

    touchChatUpdated: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      if (state.byId[chatId]) {
        state.byId[chatId].updatedAt = dayjs().toISOString();
      }
    },

    addMessageToChat: (
      state,
      action: PayloadAction<{ chatId: string; messageId: string }>
    ) => {
      const { chatId, messageId } = action.payload;
      if (state.byId[chatId]) {
        state.byId[chatId].messageIds.push(messageId);
        state.byId[chatId].updatedAt = dayjs().toISOString();
      }
    },

    clearCurrentChat: (state) => {
      state.currentChatId = null;
    },

    setShowEmptyState: (state, action: PayloadAction<boolean>) => {
      state.showEmptyState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuccess, (state) => {
        // After login, always show empty state and clear current chat
        state.currentChatId = null;
        state.showEmptyState = true;
      })
      .addCase(logoutAction, (state) => {
        state.currentChatId = null;
        state.showEmptyState = state.allIds.length === 0;
      });
  },
});

export const {
  createChat,
  deleteChat,
  setCurrentChat,
  setChatTitle,
  touchChatUpdated,
  addMessageToChat,
  clearCurrentChat,
  setShowEmptyState,
} = chatsSlice.actions;

export default chatsSlice.reducer;
