import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types';

const initialState: UIState = {
  exportBusyMessageIds: [],
  themeMode: 'light',
  snackbar: {
    open: false,
    message: '',
  },
  isTyping: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbar.open = true;
      state.snackbar.message = action.payload;
    },
    
    closeSnackbar: (state) => {
      state.snackbar.open = false;
      state.snackbar.message = '';
    },
    
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
    },
    
    setExportBusy: (
      state,
      action: PayloadAction<{ messageId: string; busy: boolean }>
    ) => {
      const { messageId, busy } = action.payload;
      if (busy) {
        if (!state.exportBusyMessageIds.includes(messageId)) {
          state.exportBusyMessageIds.push(messageId);
        }
      } else {
        state.exportBusyMessageIds = state.exportBusyMessageIds.filter(
          id => id !== messageId
        );
      }
    },
    
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
});

export const {
  openSnackbar,
  closeSnackbar,
  setThemeMode,
  setExportBusy,
  setIsTyping,
} = uiSlice.actions;

export default uiSlice.reducer;
