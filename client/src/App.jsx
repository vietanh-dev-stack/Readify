import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import { AuthProvider } from './hooks/AuthProvider';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
