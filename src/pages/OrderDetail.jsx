import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTruck, FaBox, FaClock, FaTimes } from 'react-icons/fa';
import styles from './OrderDetail.module.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch order. Status: ${response.status}`);
        }

        const orderData = await response.json();
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(`Failed to load order details: ${err.message}`);
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    } else {
      setError('Invalid order ID');
      setLoading(false);
    }
  }, [id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format price with commas for Indian Rupees
  const formatPrice = (price = 0) => {
    return "₹" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className={styles.pendingIcon} />;
      case 'confirmed':
        return <FaCheck className={styles.confirmedIcon} />;
      case 'shipped':
        return <FaTruck className={styles.shippedIcon} />;
      case 'delivered':
        return <FaBox className={styles.deliveredIcon} />;
      case 'cancelled':
        return <FaTimes className={styles.cancelledIcon} />;
      default:
        return <FaClock className={styles.pendingIcon} />;
    }
  };

  // Process image URL
  const getProcessedImageUrl = (imgUrl) => {
    if (!imgUrl) return '/images/placeholder.png';
    
    try {
      // Check if URL is already absolute
      if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        return imgUrl;
      }
      
      // Check if URL starts with //
      if (imgUrl.startsWith('//')) {
        return `https:${imgUrl}`;
      }
      
      // Handle path with duplicate '/uploads/uploads/'
      if (imgUrl.startsWith('/uploads/uploads/')) {
        return `http://localhost:5000${imgUrl.replace('/uploads/uploads/', '/uploads/')}`;
      }
      
      // Check if URL starts with /uploads
      if (imgUrl.startsWith('/uploads/')) {
        return `http://localhost:5000${imgUrl}`;
      }
      
      // If URL includes uploads directory
      if (imgUrl.includes('uploads')) {
        // Extract just the filename if it's a full path
        const filename = imgUrl.split('/').pop();
        return `http://localhost:5000/uploads/${filename}`;
      }
      
      // If it's just a filename with no path indicators
      return `${window.location.origin}/images/${imgUrl}`;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return '/images/placeholder.png';
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error || 'Order not found'}</div>
        <button className={styles.backButton} onClick={() => navigate('/profile')}>
          <FaArrowLeft /> Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className={styles.orderDetail}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/profile')}>
          <FaArrowLeft /> Back to My Orders
        </button>
        
        <h1 className={styles.title}>Order Details</h1>
        <div className={styles.orderInfo}>
          <div className={styles.orderHeader}>
            <div>
              <p className={styles.orderId}>Order ID #{order._id}</p>
              <p className={styles.orderDate}>Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className={styles.orderStatus}>
              {getStatusIcon(order.status)}
              <span className={styles[order.status]}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
          </div>
          
          <div className={styles.orderItems}>
            <h2>Items</h2>
            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item._id || item.product} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    <img 
                      src={getProcessedImageUrl(item.image)} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {formatPrice(item.price)}</p>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryTable}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{formatPrice(order.shippingAmount || 0)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>{formatPrice(order.taxAmount || 0)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.orderDetails}>
            <div className={styles.shippingInfo}>
              <h2>Shipping Information</h2>
              <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
              <p><strong>Email:</strong> {order.shippingAddress.email}</p>
              <p><strong>Address:</strong> {order.shippingAddress.street}</p>
              <p><strong>City:</strong> {order.shippingAddress.city}</p>
              <p><strong>State:</strong> {order.shippingAddress.state}</p>
              <p><strong>Zip Code:</strong> {order.shippingAddress.zipCode}</p>
              <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            </div>
            
            <div className={styles.paymentInfo}>
              <h2>Payment Information</h2>
              <p><strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').replace(/-/g, ' ').toUpperCase()}</p>
              <p><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}</p>
              {order.isPaid && order.paidAt && (
                <p><strong>Paid On:</strong> {formatDate(order.paidAt)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 