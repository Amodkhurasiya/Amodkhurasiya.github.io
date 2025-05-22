import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaUsers, FaBox, FaShoppingCart, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Trybe Admin</h2>
        </div>
        
        <div className={styles.adminInfo}>
          <div className={styles.adminName}>
            {user?.name || 'Admin User'}
          </div>
          <div className={styles.adminRole}>
            Administrator
          </div>
        </div>
        
        <nav className={styles.navigation}>
          <ul>
            <li>
              <Link to="/admin" className={styles.navLink}>
                <FaChartBar /> <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className={styles.navLink}>
                <FaBox /> <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className={styles.navLink}>
                <FaShoppingCart /> <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className={styles.navLink}>
                <FaUsers /> <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className={styles.logoutWrapper}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.pageTitle}>
            Admin Panel
          </div>
          <div className={styles.headerActions}>
            <span className={styles.welcomeText}>
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
            </span>
          </div>
        </header>
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 