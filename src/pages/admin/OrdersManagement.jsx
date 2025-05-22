import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSort, FaEye, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import styles from './OrdersManagement.module.css';

const OrdersManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get order ID from URL if available
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    if (!id && !hasFetched) {
      fetchOrders();
      setHasFetched(true);
    } else if (id && !selectedOrder) {
      // If we have an ID but no selected order, fetch just that order
      fetchSingleOrder(id);
    }
  }, [user, navigate, id, hasFetched, selectedOrder]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [orders, filterStatus, searchQuery, dateRange]);

  // If an order ID is provided in the URL, show that order's details
  useEffect(() => {
    if (id && orders.length > 0 && !selectedOrder) {
      const orderToShow = orders.find(order => order._id === id);
      if (orderToShow) {
        setSelectedOrder(orderToShow);
        setShowOrderModal(true);
      } else {
        // If order not found, fetch it specifically
        fetchSingleOrder(id);
      }
    }
  }, [id, orders, selectedOrder]);

  const fetchSingleOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Order not found');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      const orderData = await response.json();
      setSelectedOrder(orderData);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message || 'Failed to load order details');
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      console.log('Fetching orders with token:', token.substring(0, 15) + '...');
      
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      let data = await response.json();
      console.log('Orders data received:', data);
      
      // Handle case when API returns { orders: [...] } format
      if (data.orders && Array.isArray(data.orders)) {
        data = data.orders;
      }
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('Invalid orders data format:', data);
        data = [];
      }
      
      // Sort the orders
      data = sortOrders(data);
      
      setOrders(data);
      setFilteredOrders(data);

      // If we have an order ID in the URL, find and select that order
      if (id) {
        const orderToShow = data.find(order => order._id === id);
        if (orderToShow) {
          setSelectedOrder(orderToShow);
          setShowOrderModal(true);
        } else {
          // If order not found in the list, fetch it specifically
          fetchSingleOrder(id);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const sortOrders = (data) => {
    return [...data].sort((a, b) => {
      const fieldA = sortField === 'createdAt' ? new Date(a[sortField]) : a[sortField];
      const fieldB = sortField === 'createdAt' ? new Date(b[sortField]) : b[sortField];
      
      if (sortOrder === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  };

  const applyFilters = () => {
    let result = [...orders];
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(order => order.status === filterStatus);
    }
    
    // Filter by search query (customer name, email, order ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        (order.user?.name || '').toLowerCase().includes(query) ||
        (order.user?.email || '').toLowerCase().includes(query) ||
        order._id.toLowerCase().includes(query) ||
        (order.shippingAddress?.phoneNumber || '').includes(query)
      );
    }
    
    // Filter by date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter(order => new Date(order.createdAt) >= fromDate);
    }
    
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(order => new Date(order.createdAt) <= toDate);
    }
    
    setFilteredOrders(result);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    
    // Re-sort the filtered orders
    const sorted = sortOrders(filteredOrders);
    setFilteredOrders(sorted);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
    
    // Update URL without reloading the page to make the URL shareable
    navigate(`/admin/orders/${order._id}`, { replace: true });
  };

  const closeOrderDetails = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    
    // Go back to orders list without order ID in URL
    navigate('/admin/orders', { replace: true });
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      // Update the order in both states
      const updatedOrders = orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      
      const updatedFilteredOrders = filteredOrders.map(order => 
        order._id === orderId ? { ...order, status } : order
      );
      setFilteredOrders(updatedFilteredOrders);
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
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
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setSearchQuery('');
    setDateRange({ from: '', to: '' });
    setFilteredOrders(orders);
  };

  if (loading && !selectedOrder) {
    return (
      <div className={styles.ordersManagement}>
        <div className={styles.loading}>Loading orders...</div>
      </div>
    );
  }

  if (error && !selectedOrder && orders.length === 0) {
    return (
      <div className={styles.ordersManagement}>
        <div className={styles.error}>
          {error}
          <button onClick={fetchOrders} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersManagement}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/admin')}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Orders Management</h1>
      </header>

      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text"
            placeholder="Search by ID, customer, etc."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Date Range</label>
          <div className={styles.dateRangeInputs}>
            <div className={styles.dateInput}>
              <FaCalendarAlt className={styles.dateIcon} />
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className={styles.dateRangeInput}
              />
            </div>
            <span className={styles.dateRangeSeparator}>to</span>
            <div className={styles.dateInput}>
              <FaCalendarAlt className={styles.dateIcon} />
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className={styles.dateRangeInput}
              />
            </div>
          </div>
        </div>

        <button 
          className={styles.resetButton}
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      <div className={styles.ordersCount}>
        <span>Showing {filteredOrders.length} of {orders.length} orders</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('_id')}>
                  Order ID <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('user.name')}>
                  Customer <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('totalAmount')}>
                  Amount <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('createdAt')}>
                  Date <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('status')}>
                  Status <FaSort />
                </button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noOrders}>No orders found</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className={styles.orderId}>{order._id ? order._id.substring(0, 8) + '...' : 'Unknown ID'}</td>
                  <td className={styles.customerName}>{order.user?.name || order.shippingAddress?.fullName || 'Unknown'}</td>
                  <td className={styles.orderAmount}>₹{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</td>
                  <td className={styles.orderDate}>{formatDate(order.createdAt)}</td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.viewButton}
                      onClick={() => viewOrderDetails(order)}
                    >
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showOrderModal && selectedOrder && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Order Details</h2>
              <button 
                className={styles.closeButton}
                onClick={closeOrderDetails}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.orderDetails}>
              <div className={styles.orderInfo}>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`${styles.status} ${getStatusClass(selectedOrder.status)}`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </p>
              </div>
              
              <div className={styles.orderItems}>
                <h3>Items</h3>
                <ul>
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className={styles.orderItem}>
                      {item.image && (
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                      )}
                      <div className={styles.itemDetails}>
                        <p className={styles.itemName}>{item.name}</p>
                        <p className={styles.itemPrice}>₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className={styles.itemTotal}>₹{(item.price * item.quantity).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.shippingInfo}>
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
              
              <div className={styles.paymentInfo}>
                <h3>Payment Information</h3>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                <p><strong>Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Not Paid'}</p>
                {selectedOrder.isPaid && selectedOrder.paidAt && (
                  <p><strong>Paid on:</strong> {formatDate(selectedOrder.paidAt)}</p>
                )}
              </div>
              
              <div className={styles.orderSummary}>
                <h3>Summary</h3>
                <div className={styles.summaryItem}>
                  <span>Subtotal:</span>
                  <span>₹{(selectedOrder.totalAmount - selectedOrder.taxAmount - selectedOrder.shippingAmount).toLocaleString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Tax:</span>
                  <span>₹{selectedOrder.taxAmount.toLocaleString()}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.shippingAmount.toLocaleString()}</span>
                </div>
                <div className={`${styles.summaryItem} ${styles.total}`}>
                  <span>Total:</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.statusActions}>
              <h3>Update Status</h3>
              <div className={styles.statusButtons}>
                <button
                  className={`${styles.statusButton} ${selectedOrder.status === 'pending' ? styles.activeStatus : ''}`}
                  onClick={() => updateOrderStatus(selectedOrder._id, 'pending')}
                  disabled={updatingStatus || selectedOrder.status === 'pending'}
                >
                  Pending
                </button>
                <button
                  className={`${styles.statusButton} ${selectedOrder.status === 'confirmed' ? styles.activeStatus : ''}`}
                  onClick={() => updateOrderStatus(selectedOrder._id, 'confirmed')}
                  disabled={updatingStatus || selectedOrder.status === 'confirmed'}
                >
                  Confirmed
                </button>
                <button
                  className={`${styles.statusButton} ${selectedOrder.status === 'shipped' ? styles.activeStatus : ''}`}
                  onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                  disabled={updatingStatus || selectedOrder.status === 'shipped'}
                >
                  Shipped
                </button>
                <button
                  className={`${styles.statusButton} ${selectedOrder.status === 'delivered' ? styles.activeStatus : ''}`}
                  onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                  disabled={updatingStatus || selectedOrder.status === 'delivered'}
                >
                  Delivered
                </button>
                <button
                  className={`${styles.statusButton} ${styles.cancelButton} ${selectedOrder.status === 'cancelled' ? styles.activeStatus : ''}`}
                  onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
                  disabled={updatingStatus || selectedOrder.status === 'cancelled'}
                >
                  Cancelled
                </button>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.closeModalButton}
                onClick={closeOrderDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement; 
