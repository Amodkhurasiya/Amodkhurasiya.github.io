import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaEdit, FaTrash, FaBox, FaRupeeSign, FaCalendarAlt, FaTag, FaImage } from 'react-icons/fa';
import styles from './ProductDetail.module.css';
import { API_URL } from '../../utils/env';

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product. Status: ${response.status}`);
      }

      alert('Product deleted successfully');
      navigate('/admin/products');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`Failed to delete product: ${err.message}`);
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

  const formatPrice = (price = 0) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.starFilled} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className={styles.starHalf} />);
    }
    
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.starEmpty} />);
    }
    
    return (
      <div className={styles.rating}>
        {stars} <span>({rating || 0})</span>
      </div>
    );
  };

  const getProcessedImageUrl = (imgUrl) => {
    if (!imgUrl) return '/images/placeholder.png';
    
    try {
      // Get API base URL without /api path
      const apiBaseUrl = API_URL.replace('/api', '');
      
      // Check if URL is already absolute
      if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        return imgUrl;
      }
      
      // Handle relative URLs
      return `${apiBaseUrl}${imgUrl}`;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return '/images/placeholder.png';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button className={styles.backButton} onClick={() => navigate('/admin/products')}>
            <FaArrowLeft /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Product not found</p>
          <button className={styles.backButton} onClick={() => navigate('/admin/products')}>
            <FaArrowLeft /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/admin/products')}>
          <FaArrowLeft /> Back to Products
        </button>
        <h1>Product Details</h1>
      </div>

      <div className={styles.productDetailContainer}>
        <div className={styles.productImageSection}>
          <div className={styles.mainImage}>
            {product.images && product.images.length > 0 ? (
              <img 
                src={getProcessedImageUrl(product.images[0])} 
                alt={product.name} 
                className={styles.productMainImage}
              />
            ) : (
              <div className={styles.noImage}>No image available</div>
            )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {product.images.map((image, index) => (
                <img 
                  key={index} 
                  src={getProcessedImageUrl(image)} 
                  alt={`${product.name} - ${index + 1}`} 
                  className={styles.thumbnail}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.productInfo}>
          <h2 className={styles.productName}>{product.name}</h2>
          
          <div className={styles.productRating}>
            {renderRating(product.averageRating)}
            <span>{product.ratings?.length || 0} ratings</span>
          </div>
          
          <div className={styles.productMeta}>
            <div className={styles.metaItem}>
              <FaRupeeSign />
              <span>Price:</span>
              <strong>₹{formatPrice(product.price)}</strong>
            </div>
            
            <div className={styles.metaItem}>
              <FaBox />
              <span>Stock:</span>
              <strong className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </strong>
            </div>
            
            <div className={styles.metaItem}>
              <FaTag />
              <span>Category:</span>
              <strong>{product.category || 'Uncategorized'}</strong>
            </div>
            
            <div className={styles.metaItem}>
              <FaCalendarAlt />
              <span>Added on:</span>
              <strong>{formatDate(product.createdAt)}</strong>
            </div>
          </div>

          <div className={styles.productDescription}>
            <h3>Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>

          <div className={styles.actionButtons}>
            <button 
              className={styles.editButton}
              onClick={() => navigate(`/admin/products/${id}/edit`)}
            >
              <FaEdit /> Edit Product
            </button>
            <button 
              className={styles.deleteButton}
              onClick={handleDelete}
            >
              <FaTrash /> Delete Product
            </button>
          </div>
        </div>
      </div>

      {product.ratings && product.ratings.length > 0 && (
        <div className={styles.ratingSection}>
          <h3>Customer Ratings</h3>
          <div className={styles.ratingsList}>
            {product.ratings.map((rating, index) => (
              <div key={index} className={styles.ratingItem}>
                <div className={styles.ratingHeader}>
                  <strong>{rating.user?.name || 'Anonymous'}</strong>
                  <span>{formatDate(rating.date)}</span>
                </div>
                <div className={styles.ratingStars}>
                  {renderRating(rating.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductDetail; 