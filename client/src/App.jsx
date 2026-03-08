import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster position="top-right" reverseOrder={false} />
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
