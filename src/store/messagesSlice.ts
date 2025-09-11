import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessagesState } from '../types';
import { generateId } from '../utils/generateId';
import { logoutAction } from './authSlice';
import dayjs from 'dayjs';

const initialState: MessagesState = {
  byId: {},
  allIds: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addUserMessage: {
      reducer: (
        state,
        action: PayloadAction<{
          id: string;
          text: string;
          chatId: string;
          createdAt: string;
        }>
      ) => {
        const { id, text, createdAt } = action.payload;
        const message: Message = {
          id,
          role: 'user',
          text,
          createdAt,
        };

        state.byId[id] = message;
        state.allIds.push(id);
      },
      prepare: (payload: { text: string; chatId: string }) => {
        const id = generateId();
        return {
          payload: {
            ...payload,
            id,
            createdAt: dayjs().toISOString(),
          },
        };
      },
    },

    addBotMessage: {
      reducer: (
        state,
        action: PayloadAction<{
          id: string;
          text: string;
          sql: string;
          datasetKey: string;
          chatId: string;
          createdAt: string;
        }>
      ) => {
        const { id, text, sql, datasetKey, createdAt } = action.payload;
        const message: Message = {
          id,
          role: 'bot',
          text,
          sql,
          viewMode: 'table', // Default view mode
          datasetKey,
          feedback: null,
          createdAt,
        };

        state.byId[id] = message;
        state.allIds.push(id);
      },
      prepare: (payload: {
        text: string;
        sql: string;
        datasetKey: string;
        chatId: string;
      }) => {
        const id = generateId();
        return {
          payload: {
            ...payload,
            id,
            createdAt: dayjs().toISOString(),
          },
        };
      },
    },

    setMessageViewMode: (
      state,
      action: PayloadAction<{
        messageId: string;
        viewMode: 'table' | 'chart' | 'both';
      }>
    ) => {
      const { messageId, viewMode } = action.payload;
      if (state.byId[messageId]) {
        state.byId[messageId].viewMode = viewMode;
      }
    },

    setMessageFeedback: (
      state,
      action: PayloadAction<{
        messageId: string;
        feedback: 'like' | 'dislike' | null;
      }>
    ) => {
      const { messageId, feedback } = action.payload;
      if (state.byId[messageId]) {
        state.byId[messageId].feedback = feedback;
      }
    },

    clearMessages: (state) => {
      state.byId = {};
      state.allIds = [];
    },

    deleteMessagesForChat: (state, action: PayloadAction<string[]>) => {
      const messageIds = action.payload;
      messageIds.forEach((messageId) => {
        delete state.byId[messageId];
      });
      state.allIds = state.allIds.filter((id) => !messageIds.includes(id));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutAction, (state) => {
      // При выходе сообщения сохраняем (не очищаем)
      // Сообщения привязаны к чатам, поэтому их тоже нужно сохранить
    });
  },
});

export const {
  addUserMessage,
  addBotMessage,
  setMessageViewMode,
  setMessageFeedback,
  clearMessages,
  deleteMessagesForChat,
} = messagesSlice.actions;

export default messagesSlice.reducer;
