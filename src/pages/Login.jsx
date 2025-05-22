import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { authAPI } from '../services/api';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Get redirect path from URL query parameter
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(loginStart());
    
    try {
      const response = await authAPI.login(formData);
      
      // Login successful with the updated response format
      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      
      // Redirect to the specified path or home page
      navigate(redirectPath);
    } catch (error) {
      dispatch(loginFailure(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      ));
    }
  };
  
  const handleAdminLogin = () => {
    navigate('/admin/login');
  };
  
  return (
    <div className={styles.loginPage}>
      <div className="container">
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <h1 className={styles.title}>Login</h1>
            <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FaEnvelope />
                  </span>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? styles.inputError : ''}
                  />
                </div>
                {formErrors.email && <p className={styles.errorMessage}>{formErrors.email}</p>}
              </div>
              
              <div className={styles.formGroup}>
                <div className={styles.passwordLabel}>
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                    Forgot Password?
                  </Link>
                </div>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={formErrors.password ? styles.inputError : ''}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {formErrors.password && <p className={styles.errorMessage}>{formErrors.password}</p>}
              </div>
              
              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className={styles.adminLoginSection}>
              <button 
                onClick={handleAdminLogin} 
                className={styles.adminLoginButton}
              >
                Login as Admin
              </button>
            </div>
            
            <p className={styles.registerPrompt}>
              Don't have an account? <Link to="/register" className={styles.registerLink}>Register</Link>
            </p>
          </div>
          
          <div className={styles.loginImage}>
            <div className={styles.imageOverlay}></div>
            <div className={styles.welcomeMessage}>
              <h2>Welcome to Trybe</h2>
              <p>Discover the authentic tribal artistry from across India.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 