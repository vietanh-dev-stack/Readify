import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;