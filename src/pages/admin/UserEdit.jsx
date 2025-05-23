import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import styles from './UserEdit.module.css';
import { API_URL } from '../../utils/env';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/admin/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user. Status: ${response.status}`);
        }

        const userData = await response.json();
        
        // Format the data for the form
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'customer',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            pincode: userData.address?.pincode || '',
            country: userData.address?.country || ''
          }
        });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate the form data before submission
  const validateForm = () => {
    // Required fields validation
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';
    
    // Phone validation (optional)
    if (formData.phone && !/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) {
      return 'Please enter a valid phone number';
    }
    
    // Postal code validation (optional)
    if (formData.address.pincode && !/^[0-9]{5,10}$/.test(formData.address.pincode)) {
      return 'Please enter a valid postal code (5-10 digits)';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Validate form before submission
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update user. Status: ${response.status}`);
      }

      alert('User updated successfully');
      navigate(`/admin/users/${id}`);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
      // Don't show alert here - we'll display the error in the UI
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading user details...</div>
      </div>
    );
  }

  if (error && !formData.name) {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(`/admin/users/${id}`)}>
          <FaArrowLeft /> Back to User
        </button>
        <h1>Edit User</h1>
      </div>

      <form className={styles.userForm} onSubmit={handleSubmit}>
        {error && (
          <div className={styles.formError}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.formSection}>
          <h3>Basic Information</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.formControl}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.formControl}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Address Information</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="address.street">Street Address</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address?.street || ''}
              onChange={handleChange}
              className={styles.formControl}
              placeholder="Enter street address"
            />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="address.city">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address?.city || ''}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="Enter city"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address.state">State</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address?.state || ''}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="Enter state/province"
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="address.pincode">Postal Code</label>
              <input
                type="text"
                id="address.pincode"
                name="address.pincode"
                value={formData.address?.pincode || ''}
                onChange={handleChange}
                className={styles.formControl}
                pattern="[0-9]*"
                maxLength="10"
                placeholder="Enter postal code"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address.country">Country</label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={formData.address?.country || ''}
                onChange={handleChange}
                className={styles.formControl}
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? 'Saving...' : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
          
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(`/admin/users/${id}`)}
            disabled={saving}
          >
            <FaTimes /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit; 