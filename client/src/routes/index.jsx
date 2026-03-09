import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Home from '../pages/home/Home';
import Detail from '../pages/book/Detail';
import Profile from '../pages/profile/Profile';
import Cart from '../pages/cart/Cart';
import Wishlist from '../pages/client/Wishlist';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* application layout */}
      <Route
        path="/"
        element={<MainLayout />}
      >
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="book/:id" element={<Detail />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;