import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { authAPI } from '../services/api';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authAPI.forgotPassword({ email });
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <div className="container">
        <div className={styles.forgotPasswordContainer}>
          <div className={styles.formContainer}>
            <h1 className={styles.title}>Forgot Password</h1>
            <p className={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            {success ? (
              <div className={styles.successMessage}>
                <h2>Email Sent!</h2>
                <p>
                  If an account exists with the email you provided, you will receive 
                  password reset instructions shortly.
                </p>
                <Link to="/login" className={styles.backToLoginLink}>
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleChange}
                      className={emailError ? styles.inputError : ''}
                    />
                  </div>
                  {emailError && <p className={styles.errorMessage}>{emailError}</p>}
                </div>
                
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                
                <div className={styles.loginPrompt}>
                  <Link to="/login" className={styles.loginLink}>
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
          
          <div className={styles.imageContainer}>
            <div className={styles.imageOverlay}></div>
            <div className={styles.message}>
              <h2>Recover Your Account</h2>
              <p>We'll help you get back to exploring tribal artistry from across India.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 