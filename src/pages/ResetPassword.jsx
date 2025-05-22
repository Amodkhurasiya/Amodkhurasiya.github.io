import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../services/api';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        await authAPI.validateResetToken(token);
      } catch (error) {
        setTokenValid(false);
        setError('This password reset link is invalid or has expired. Please request a new one.');
      }
    };

    if (token) {
      validateToken();
    } else {
      setTokenValid(false);
      setError('Invalid password reset link. Please request a new one.');
    }
  }, [token]);

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

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authAPI.resetPassword({
        token,
        email,
        password: formData.password
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPasswordPage}>
      <div className="container">
        <div className={styles.resetPasswordContainer}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>
              Create a new password for your account.
            </p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            {success ? (
              <div className={styles.successMessage}>
                <h2>Password Reset Successful!</h2>
                <p>
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </p>
                <Link to="/login" className={styles.loginLink}>
                  Login Now
                </Link>
              </div>
            ) : (
              tokenValid && (
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">New Password</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={handleChange}
                        className={formErrors.password ? styles.inputError : ''}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('password')}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formErrors.password && <p className={styles.errorMessage}>{formErrors.password}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>
                        <FaLock />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={formErrors.confirmPassword ? styles.inputError : ''}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('confirm')}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className={styles.errorMessage}>{formErrors.confirmPassword}</p>}
                  </div>
                  
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )
            )}
            
            {!success && (
              <div className={styles.loginPrompt}>
                <Link to="/login" className={styles.loginLink}>
                  Back to Login
                </Link>
              </div>
            )}
          </div>
          
          <div className={styles.imageContainer}>
            <div className={styles.imageOverlay}></div>
            <div className={styles.message}>
              <h2>Secure Your Account</h2>
              <p>Create a strong password to protect your account and continue exploring tribal artistry.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 