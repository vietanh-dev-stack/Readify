import './App.css'
import AppRoutes from './routes'
import { AuthProvider } from './hooks/AuthProvider';

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
