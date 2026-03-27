import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';
import Home from '../pages/home/Home';
import Detail from '../pages/book/Detail';
import Profile from '../pages/profile/Profile';
import Cart from '../pages/cart/Cart';
import Checkout from '../pages/checkout/Checkout';
import PaymentResult from '../pages/checkout/PaymentResult';
import Wishlist from '../pages/client/Wishlist';
import Blog from '../pages/blog/Blog';
import Contact from '../pages/contact/Contact';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import BookManagement from '../pages/admin/BookManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import AuthorManagement from '../pages/admin/AuthorManagement';
import PublisherManagement from '../pages/admin/PublisherManagement';
import SeriesManagement from '../pages/admin/SeriesManagement';
import BlogManagement from '../pages/admin/BlogManagement';
import BlogDetail from '../pages/blog/BlogDetail';
import OrderManagement from '../pages/admin/OrderManagement';

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
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="payment-result" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
        <Route path="payment-success" element={<ProtectedRoute><PaymentResult /></ProtectedRoute>} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path='/blog' element={<Blog/>}/>
        <Route path='blog/:id' element={<BlogDetail/>}/>
        <Route path='/contact' element={<Contact/>}/>
      </Route>

      {/* admin layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="authors" element={<AuthorManagement />} />
        <Route path="publishers" element={<PublisherManagement />} />
        <Route path="series" element={<SeriesManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path='blogs' element={<BlogManagement/>}/>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
