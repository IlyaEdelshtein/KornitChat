import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  } | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

// Hardcoded user for demo
const DEMO_USER = {
  username: 'admin',
  password: 'admin',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<{ username: string }>) => {
      state.isAuthenticated = true;
      state.user = { username: action.payload.username };
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout: logoutAction,
  clearError,
} = authSlice.actions;

// Thunk для логина
export const loginUser = (username: string, password: string) => {
  return (dispatch: any, getState: any) => {
    dispatch(loginStart());

    // Simulate API delay
    setTimeout(() => {
      if (username === DEMO_USER.username && password === DEMO_USER.password) {
        dispatch(loginSuccess({ username }));
      } else {
        dispatch(loginFailure('Invalid username or password'));
      }
    }, 500);
  };
};

// Thunk для выхода
export const logout = () => {
  return (dispatch: any) => {
    dispatch(logoutAction());
  };
};

export default authSlice.reducer;
