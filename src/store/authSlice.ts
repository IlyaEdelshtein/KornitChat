import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  } | null;
  error: string | null;
  justLoggedIn: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  justLoggedIn: false,
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
      state.justLoggedIn = true;
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
      state.justLoggedIn = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearJustLoggedIn: (state) => {
      state.justLoggedIn = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout: logoutAction,
  clearError,
  clearJustLoggedIn,
} = authSlice.actions;

export const loginUser = (username: string, password: string) => {
  return (dispatch: any) => {
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

export const logout = () => {
  return (dispatch: any) => {
    dispatch(logoutAction());
  };
};

export default authSlice.reducer;
