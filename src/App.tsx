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
import { getBaseName } from './utils/navigation';

function ThemedApp() {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  
  // Use dynamic basename for GitHub Pages
  const basename = getBaseName();

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
          html: {
            height: '100%',
            overflow: 'hidden',
          },
          body: {
            height: '100%',
            overflow: 'hidden',
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
          '#root': {
            height: '100%',
            overflow: 'hidden',
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
