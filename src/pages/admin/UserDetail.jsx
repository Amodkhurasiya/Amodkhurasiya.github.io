import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
         FaMapMarkerAlt, FaUserShield, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './UserDetail.module.css';
import { API_URL } from '../../utils/env';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        // Fetch user details
        const userResponse = await fetch(`${API_URL}/admin/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user. Status: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's orders
        const ordersResponse = await fetch(`${API_URL}/admin/users/${id}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders || []);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleEditUser = () => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }

      alert('User deleted successfully');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`Failed to delete user: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatOrderStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      <div className={styles.container}>
        <div className={styles.loading}>Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button className={styles.backButton} onClick={() => navigate('/admin/users')}>
            <FaArrowLeft /> Back to Users
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>User not found</p>
          <button className={styles.backButton} onClick={() => navigate('/admin/users')}>
            <FaArrowLeft /> Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/admin/users')}>
          <FaArrowLeft /> Back to Users
        </button>
        <h1>User Details</h1>
      </div>

      <div className={styles.userCard}>
        <div className={styles.userHeader}>
          <div className={styles.userAvatar}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className={styles.defaultAvatar}>
                <FaUser />
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <h2>{user.name}</h2>
            <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.adminBadge : styles.customerBadge}`}>
              {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
              {user.role}
            </span>
          </div>
        </div>

        <div className={styles.detailsContainer}>
          <div className={styles.detailSection}>
            <h3>Contact Information</h3>
            <div className={styles.detailItem}>
              <FaEnvelope />
              <span>Email:</span>
              <strong>{user.email}</strong>
            </div>
            <div className={styles.detailItem}>
              <FaPhone />
              <span>Phone:</span>
              <strong>{user.phone || 'Not provided'}</strong>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Account Information</h3>
            <div className={styles.detailItem}>
              <FaCalendarAlt />
              <span>Joined:</span>
              <strong>{formatDate(user.createdAt)}</strong>
            </div>
            <div className={styles.detailItem}>
              <FaCalendarAlt />
              <span>Last Login:</span>
              <strong>{formatDate(user.lastLogin)}</strong>
            </div>
          </div>

          {user.address && (
            <div className={styles.detailSection}>
              <h3>Address</h3>
              <div className={styles.detailItem}>
                <FaMapMarkerAlt />
                <span>Address:</span>
                <strong>
                  {user.address.street}, {user.address.city}, {user.address.state} {user.address.pincode}, {user.address.country}
                </strong>
              </div>
            </div>
          )}
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.editButton} onClick={handleEditUser}>
            <FaEdit /> Edit User
          </button>
          <button className={styles.deleteButton} onClick={handleDeleteUser}>
            <FaTrash /> Delete User
          </button>
        </div>
      </div>

      <div className={styles.ordersSection}>
        <h3>Order History</h3>
        {orders.length > 0 ? (
          <div className={styles.ordersTable}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>₹{order.totalAmount?.toLocaleString() || '0'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                        {formatOrderStatus(order.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.viewOrderButton}
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noOrders}>No orders found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail; 