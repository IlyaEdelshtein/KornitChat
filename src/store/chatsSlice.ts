import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat, ChatsState } from '../types';
import { generateId } from '../utils/generateId';
import dayjs from 'dayjs';

const initialState: ChatsState = {
  byId: {},
  allIds: [],
  currentChatId: null,
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
      // The UI will handle setting a new current chat
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
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
  },
});

export const {
  createChat,
  deleteChat,
  setCurrentChat,
  setChatTitle,
  touchChatUpdated,
  addMessageToChat,
} = chatsSlice.actions;

export default chatsSlice.reducer;
