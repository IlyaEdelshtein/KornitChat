import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store, persistor } from './store';
import { useAppSelector } from './store';
import AppShell from './components/AppShell';
import ChatView from './components/ChatView';
import ProtectedRoute from './components/ProtectedRoute';

function ThemedApp() {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  
  // Use basename only for GitHub Pages deployment, not for local development
  const basename = window.location.hostname === 'localhost' ? '' : '/KornitChat';

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.2)',
              borderRadius: '4px',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={basename}>
        <ProtectedRoute>
          <AppShell>
            <Routes>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<ChatView />} />
              <Route path="/chat/:chatId" element={<ChatView />} />
            </Routes>
          </AppShell>
        </ProtectedRoute>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemedApp />
      </PersistGate>
    </Provider>
  );
}

export default App;
