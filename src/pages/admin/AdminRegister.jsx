import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaKey } from 'react-icons/fa';
import styles from './AdminLogin.module.css';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character';
    }

    // Admin key validation
    if (!formData.adminKey) {
      errors.adminKey = 'Admin key is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await authAPI.registerAdmin(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response?.data?.errors) {
        // Handle validation errors from the server
        const serverErrors = error.response.data.errors;
        const errorMessages = serverErrors.map(err => err.msg).join(', ');
        setError(errorMessages);
      } else if (error.response?.data?.message) {
        // Handle other server errors
        setError(error.response.data.message);
      } else {
        // Handle network or other errors
        setError('Registration failed. Please try again later.');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.adminLogin}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>Admin Registration</h1>
          <p>Create a new admin account with enhanced security.</p>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FaUser />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={validationErrors.name ? styles.inputError : ''}
                />
              </div>
              {validationErrors.name && (
                <p className={styles.errorMessage}>{validationErrors.name}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  className={validationErrors.email ? styles.inputError : ''}
                />
              </div>
              {validationErrors.email && (
                <p className={styles.errorMessage}>{validationErrors.email}</p>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  className={validationErrors.password ? styles.inputError : ''}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {validationErrors.password && (
                <p className={styles.errorMessage}>{validationErrors.password}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="adminKey">Admin Key</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <FaKey />
                </span>
                <input
                  type="password"
                  id="adminKey"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleChange}
                  placeholder="Enter admin registration key"
                  className={validationErrors.adminKey ? styles.inputError : ''}
                />
              </div>
              {validationErrors.adminKey && (
                <p className={styles.errorMessage}>{validationErrors.adminKey}</p>
              )}
            </div>
            
            <button type="submit" className={styles.loginButton}>
              Register Admin
            </button>
          </form>

          <div className={styles.backToMain}>
            <button onClick={() => navigate('/admin/login')} className={styles.backButton}>
              Back to Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister; 