import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUserShield, FaUser, FaSearch, FaSort, FaUserEdit, FaTrash, FaEye, FaArrowLeft } from 'react-icons/fa';
import styles from './UsersManagement.module.css';
import { API_URL } from '../../utils/env';

const UsersManagement = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete user. Status: ${response.status}`);
      }
      
      // Remove the deleted user from state
      setUsers(users.filter(u => u._id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const applyFilters = () => {
    let result = [...users];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply role filter
    if (filters.role !== 'all') {
      result = result.filter(user => user.role === filters.role);
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        // Handle date fields specially
        if (filters.sortBy === 'createdAt' || filters.sortBy === 'lastLogin') {
          const dateA = new Date(a[filters.sortBy] || 0);
          const dateB = new Date(b[filters.sortBy] || 0);
          return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Default string comparison
        const valueA = a[filters.sortBy] || '';
        const valueB = b[filters.sortBy] || '';
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return filters.sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        return 0;
      });
    }

    setFilteredUsers(result);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const getUserStats = () => {
    return {
      total: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      customer: users.filter(u => u.role === 'customer' || u.role !== 'admin').length
    };
  };

  const stats = getUserStats();

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role) => {
    return role === 'admin' ? styles.adminBadge : styles.customerBadge;
  };

  if (loading) {
    return (
      <div className={styles.usersManagement}>
        <div className={styles.loading}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.usersManagement}>
        <div className={styles.error}>
          {error}
          <button onClick={fetchUsers} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usersManagement}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/admin')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Users Management</h1>
      </header>

      <div className={styles.statsOverview}>
        <div>Total Users: <span>{stats.total}</span></div>
        <div>Admins: <span>{stats.admin}</span></div>
        <div>Customers: <span>{stats.customer}</span></div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Role:</label>
          <select 
            className={styles.filterSelect}
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Search:</label>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users by name, email or phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <button className={styles.resetButton} onClick={resetFilters}>
          Clear Filters
        </button>
      </div>

      <div className={styles.resultSummary}>
        <span>Showing {filteredUsers.length} of {users.length} users</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('name')}>
                  Name <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('email')}>
                  Email <FaSort />
                </button>
              </th>
              <th>Phone</th>
              <th>Role</th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('createdAt')}>
                  Joined <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('lastLogin')}>
                  Last Login <FaSort />
                </button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className={styles.userName}>{user.name || 'No Name'}</td>
                  <td className={styles.userEmail}>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                      {user.role === 'admin' ? <FaUserShield /> : <FaUser />}
                      {user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        title="View User Details"
                      >
                        <FaEye /> <span>View</span>
                      </button>
                      <button 
                        className={styles.editButton}
                        onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                        title="Edit User"
                      >
                        <FaUserEdit /> <span>Edit</span>
                      </button>
                      {user._id !== localStorage.getItem('userId') && (
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete User"
                        >
                          <FaTrash /> <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={styles.noUsers}>
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement; 