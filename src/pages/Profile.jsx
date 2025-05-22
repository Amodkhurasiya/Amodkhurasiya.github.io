import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaHeart, FaHistory, FaUser, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import styles from './Profile.module.css';
import { userAPI, orderAPI } from '../services/api';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);
  
  // Initialize user data from Redux store
  const [userData, setUserData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'India',
    phoneNumber: user?.phoneNumber || ''
  });

  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update user data whenever Redux user changes
  useEffect(() => {
    if (user) {
      console.log('Updating profile with user data:', user);
      
      // Split name into first and last name
      let firstName = '';
      let lastName = '';
      
      if (user.name) {
        const nameParts = user.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      const updatedUserData = {
        firstName,
        lastName,
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || 'India',
        phoneNumber: user.phoneNumber || ''
      };
      
      setUserData(updatedUserData);
      setFormData(updatedUserData);
    }
  }, [user]);

  // Fetch user profile data from API on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await userAPI.getUserProfile();
        
        if (response.data) {
          const userData = response.data;
          
          // Split name into first and last name
          let firstName = '';
          let lastName = '';
          
          if (userData.name) {
            const nameParts = userData.name.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
          }
          
          const updatedUserData = {
            firstName,
            lastName,
            email: userData.email || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            postalCode: userData.postalCode || '',
            country: userData.country || 'India',
            phoneNumber: userData.phoneNumber || ''
          };
          
          // Update Redux store with fetched user data
          dispatch(updateProfile(userData));
          
          // Update local state
          setUserData(updatedUserData);
          setFormData(updatedUserData);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [dispatch, token]);

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await orderAPI.getOrderHistory();
        
        if (response.data) {
          setOrderHistory(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeSection === 'orders') {
      fetchOrders();
    }
  }, [token, activeSection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Combine first and last name into a single name field
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      const updatedUserData = {
        name: fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phoneNumber: formData.phoneNumber
      };
      
      console.log('Updating profile with:', updatedUserData);
      
      // Call API to update profile
      const response = await userAPI.updateUserProfile(updatedUserData);
      
      // Update Redux store
      dispatch(updateProfile(response.data));
      
      // Update local state
      setUserData({
        ...formData,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({...userData});
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      
      // Call API to change password
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form and show success message
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccessMessage('Password changed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // Call API to delete account
      await userAPI.deleteAccount();
      
      // Logout user and redirect to home
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      navigate('/');
      window.location.reload(); // Force reload to reset Redux state
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format price function
  const formatPrice = (price) => {
    if (!price && price !== 0) return "₹0";
    return "₹" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle view order details
  const handleViewOrderDetails = (orderId) => {
    // Navigate to order details page
    navigate(`/orders/${orderId}`);
  };

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login?redirect=/profile" />;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Account</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        {successMessage && <div className={styles.success}>{successMessage}</div>}
        
        <div className={styles.profileNavigationLinks}>
          <button 
            className={`${styles.profileNavLink} ${activeSection === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <FaUser className={styles.navIcon} />
            <span>Personal Information</span>
          </button>
          <button 
            className={`${styles.profileNavLink} ${activeSection === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <FaHistory className={styles.navIcon} />
            <span>Order History</span>
          </button>
          <button 
            className={`${styles.profileNavLink} ${activeSection === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <FaCog className={styles.navIcon} />
            <span>Account Settings</span>
          </button>
        </div>
        
        {activeSection === 'profile' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly
                    />
                    <small>Email cannot be changed</small>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveButton} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Name:</span>
                    <span className={styles.fieldValue}>{userData.firstName} {userData.lastName}</span>
                  </div>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Email:</span>
                    <span className={styles.fieldValue}>{userData.email}</span>
                  </div>
                </div>
                
                <div className={styles.infoRow}>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Phone:</span>
                    <span className={styles.fieldValue}>{userData.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
                
                <div className={styles.infoRow}>
                  <div className={styles.infoField}>
                    <span className={styles.fieldLabel}>Address:</span>
                    <span className={styles.fieldValue}>
                      {userData.address ? (
                        <>
                          {userData.address}<br />
                          {userData.city ? `${userData.city}, ` : ''}
                          {userData.state ? `${userData.state}, ` : ''}
                          {userData.postalCode ? `${userData.postalCode}, ` : ''}
                          {userData.country || ''}
                        </>
                      ) : (
                        'Not provided'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'orders' && (
          <div className={styles.section} id="orders">
            <h2>Order History</h2>
            {loading ? (
              <div className={styles.loadingSpinner}>Loading your orders...</div>
            ) : orderHistory.length > 0 ? (
              <div className={styles.orderHistoryTable}>
                <div className={styles.orderHeader}>
                  <span>Order ID</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Total</span>
                  <span></span>
                </div>
                {orderHistory.map(order => (
                  <div key={order._id} className={styles.orderRow}>
                    <span>{order._id}</span>
                    <span>{formatDate(order.createdAt)}</span>
                    <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                    <span>{formatPrice(order.totalAmount)}</span>
                    <button 
                      className={styles.viewOrderButton} 
                      onClick={() => handleViewOrderDetails(order._id)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noOrders}>
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className={styles.shopNowButton}>
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'settings' && (
          <div className={styles.section}>
            <h2>Account Settings</h2>
            <div className={styles.accountSettings}>
              <div className={styles.changePasswordContainer}>
                <h3>Change Password</h3>
                {passwordError && <div className={styles.error}>{passwordError}</div>}
                <form className={styles.form} onSubmit={handleChangePassword}>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <button type="submit" className={styles.changePasswordButton} disabled={loading}>
                    {loading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
              
              <div className={styles.deleteAccountContainer}>
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all your data.</p>
                
                {!showDeleteConfirm ? (
                  <button 
                    className={styles.deleteAccountButton}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className={styles.deleteConfirmation}>
                    <div className={styles.deleteWarning}>
                      <FaExclamationTriangle className={styles.warningIcon} />
                      <p>This action cannot be undone. All your data will be permanently deleted.</p>
                    </div>
                    <div className={styles.deleteButtons}>
                      <button
                        className={styles.cancelDeleteButton}
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className={styles.confirmDeleteButton}
                        onClick={handleDeleteAccount}
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 