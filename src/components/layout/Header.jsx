import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaShoppingCart, FaUserAlt, FaSearch, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items, totalQuantity } = useSelector((state) => state.cart);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Close search
      setIsSearchOpen(false);
      // Navigate to search results
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };
  
  // Check if current route is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.tribal}></div>
      
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>
              <span className={styles.logoMain}>TRYBEE</span>
              <span className={styles.logoTagline}>The Art of Tribe</span>
            </span>
          </Link>
        </div>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <div className={styles.mobileCloseWrapper}>
            <button 
              className={styles.mobileClose}
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>
          
          <ul className={styles.navList}>
            <li className={isActive('/') ? styles.active : ''}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className={isActive('/products') ? styles.active : ''}>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            </li>
            <li className={isActive('/about') ? styles.active : ''}>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
            </li>
            <li className={isActive('/contact') ? styles.active : ''}>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        </nav>
        
        <div className={styles.actions}>
          <button 
            className={styles.searchBtn}
            onClick={toggleSearch}
            aria-label="Search"
          >
            <FaSearch />
          </button>
          
          <Link 
            to="/cart" 
            className={styles.cartBtn}
            aria-label="Shopping cart"
          >
            <FaShoppingCart />
            {totalQuantity > 0 && (
              <span className={styles.cartCount}>{totalQuantity}</span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className={styles.userDropdown}>
              <button className={styles.userBtn}>
                <FaUserAlt />
                <span className={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</span>
              </button>
              <div className={styles.dropdownContent}>
                <Link to="/profile" className={styles.dropdownItem}>
                  My Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className={styles.dropdownItem}>
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  className={styles.dropdownItem} 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={styles.authBtn}>
              Login <FaArrowRight className={styles.authBtnIcon} />
            </Link>
          )}
          
          <button 
            className={styles.menuBtn}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <FaBars />
          </button>
        </div>
      </div>
      
      {/* Search Overlay */}
      <div className={`${styles.searchOverlay} ${isSearchOpen ? styles.active : ''}`}>
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input 
              id="search-input"
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchSubmit}>
              <FaSearch />
            </button>
          </form>
          <button 
            className={styles.searchClose}
            onClick={toggleSearch}
            aria-label="Close search"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 