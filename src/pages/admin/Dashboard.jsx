import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUsers, FaShoppingBag, FaRupeeSign, FaShoppingCart, FaPlus, FaArrowLeft, FaEye } from 'react-icons/fa';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    recentOrders: []
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
          navigate('/admin/login');
          return;
        }

        // Fetch dashboard stats
        await fetchDashboardStats();
        setLoading(false);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      // Fetch dashboard statistics
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard stats');
      }

      const data = await response.json();
      console.log('Dashboard stats:', data);
      
      // Fetch recent orders separately for more details
      const ordersResponse = await fetch('http://localhost:5000/api/admin/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      let recentOrders = [];
      let calculatedTotalSales = 0;

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        console.log('Recent orders data:', ordersData);
        
        // Handle different API response formats
        if (ordersData.orders && Array.isArray(ordersData.orders)) {
          recentOrders = ordersData.orders;
        } else if (Array.isArray(ordersData)) {
          recentOrders = ordersData;
        }

        // Calculate total sales from orders if not provided by the API
        if (!data.totalSales || data.totalSales === 0) {
          calculatedTotalSales = recentOrders.reduce((sum, order) => {
            return sum + (order.totalAmount || 0);
          }, 0);
        }
      }
      
      // Ensure all stats have default values if they're missing
      setStats({
        totalUsers: data.totalUsers || 0,
        totalProducts: data.totalProducts || 0,
        totalSales: data.totalSales || calculatedTotalSales || 0,
        totalOrders: data.totalOrders || 0,
        recentOrders: recentOrders.slice(0, 5) // Limit to 5 most recent
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.message || 'Failed to load dashboard data');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'shipped':
        return styles.statusShipped;
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          {error}
          <button onClick={fetchDashboardStats} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.userInfo}>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleBackToHome} className={styles.backButton}>
            <FaArrowLeft /> Back to Home
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaShoppingBag />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Products</h3>
            <p>{stats.totalProducts}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaRupeeSign />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Sales</h3>
            <p>₹{stats.totalSales?.toLocaleString() || '0'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaShoppingCart />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className={styles.recentOrders}>
        <h2>Recent Orders</h2>
        {stats.recentOrders.length > 0 ? (
          <div className={styles.ordersList}>
            {stats.recentOrders.map(order => (
              <div key={order._id} className={styles.orderItem}>
                <div className={styles.orderInfo}>
                  <div className={styles.orderId}>Order #{order._id.slice(-6)}</div>
                  <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                  <div className={styles.orderCustomer}>
                    {order.user?.name || order.shippingInfo?.name || 'Anonymous'}
                  </div>
                </div>
                <div className={styles.orderAmount}>₹{order.totalAmount?.toLocaleString() || '0'}</div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {order.status || 'Pending'}
                </div>
                <button 
                  onClick={() => navigate(`/admin/orders/${order._id}`)} 
                  className={styles.viewButton}
                >
                  <FaEye /> View
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noOrders}>No recent orders found.</p>
        )}
        <button 
          onClick={() => navigate('/admin/orders')} 
          className={styles.viewAllButton}
        >
          View All Orders
        </button>
      </div>

      <div className={styles.actions}>
        <button onClick={() => navigate('/admin/products')} className={styles.actionButton}>
          <FaShoppingBag /> Manage Products
        </button>
        <button onClick={() => navigate('/admin/products/add')} className={styles.actionButton}>
          <FaPlus /> Add New Product
        </button>
        <button onClick={() => navigate('/admin/orders')} className={styles.actionButton}>
          <FaShoppingCart /> View Orders
        </button>
        <button onClick={() => navigate('/admin/users')} className={styles.actionButton}>
          <FaUsers /> Manage Users
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard; 