import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Shipping from './pages/Shipping'
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminDashboard from './pages/admin/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import ProductManagement from './pages/admin/ProductManagement'
import OrdersManagement from './pages/admin/OrdersManagement'
import AddProduct from './pages/admin/AddProduct'
import UsersManagement from './pages/admin/UsersManagement'
import AdminProductDetail from './pages/admin/ProductDetail'
import UserDetail from './pages/admin/UserDetail'
import UserEdit from './pages/admin/UserEdit'
import OrderDetail from './pages/OrderDetail'
import './App.css'

function App() {
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        
        <Route path="/admin" element={<AdminRoute />}>
          <Route
            index
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="products"
            element={
              <AdminLayout>
                <ProductManagement />
              </AdminLayout>
            }
          />
          <Route
            path="products/:id"
            element={
              <AdminLayout>
                <AdminProductDetail />
              </AdminLayout>
            }
          />
          <Route
            path="products/add"
            element={
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            }
          />
          <Route
            path="orders"
            element={
              <AdminLayout>
                <OrdersManagement />
              </AdminLayout>
            }
          />
          <Route
            path="orders/:id"
            element={
              <AdminLayout>
                <OrdersManagement />
              </AdminLayout>
            }
          />
          <Route
            path="users"
            element={
              <AdminLayout>
                <UsersManagement />
              </AdminLayout>
            }
          />
          <Route
            path="users/:id"
            element={
              <AdminLayout>
                <UserDetail />
              </AdminLayout>
            }
          />
          <Route
            path="users/:id/edit"
            element={
              <AdminLayout>
                <UserEdit />
              </AdminLayout>
            }
          />
        </Route>
        
        {/* Public Routes with standard layout */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/shipping" element={<Shipping />} />

                  {/* Protected Routes */}
                  <Route 
                    path="/cart" 
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <PrivateRoute>
                        <Checkout />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/orders/:id" 
                    element={
                      <PrivateRoute>
                        <OrderDetail />
                      </PrivateRoute>
                    } 
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App 