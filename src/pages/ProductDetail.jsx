import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { productAPI } from '../services/api';
import { FaShoppingCart, FaArrowLeft, FaStar, FaStarHalfAlt, FaRegStar, FaImage } from 'react-icons/fa';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { BsHeartFill } from 'react-icons/bs';
import styles from './ProductDetail.module.css';
import { productRatingAPI } from '../services/api';
import { API_URL } from '../utils/env';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('Details');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log('Fetching product details for ID:', id);
        // Use environment variable for API URL
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }
        
        const productData = await response.json();
        console.log('Product data received:', productData);
        
        // Set defaults for potentially missing fields
        const processedProduct = {
          ...productData,
          rating: productData.rating || 0,
          stock: productData.stock || 0,
          images: productData.images || [],
          tribe: productData.tribe || 'Unknown',
          artisan: productData.artisan || 'Unknown Artisan',
          region: productData.region || 'Unknown Region'
        };
        
        setProduct(processedProduct);
        
        // Try to get user's rating from the API first
        try {
          const userRatingValue = await productRatingAPI.getUserRating(id);
          if (userRatingValue) {
            setUserRating(userRatingValue);
          } else {
            // Fallback to local storage if API doesn't return a rating
            const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts') || '{}');
            if (ratedProducts[processedProduct._id]) {
              setUserRating(ratedProducts[processedProduct._id]);
            }
          }
        } catch (ratingErr) {
          console.error('Error fetching user rating:', ratingErr);
          // Fallback to local storage
          const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts') || '{}');
          if (ratedProducts[processedProduct._id]) {
            setUserRating(ratedProducts[processedProduct._id]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Could not fetch product details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      try {
        // Ensure we're using the correct image URL
        let productImage = '/images/placeholder.png';
        
        if (product.images && product.images.length > 0) {
          productImage = getProcessedImageUrl(product.images[selectedImage]);
        }
        
        const itemToAdd = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: productImage,
          tribe: product.tribe || 'Unknown Tribe',
          quantity: quantity,
          stock: product.stock
        };
        
        console.log('Adding to cart:', itemToAdd);
        dispatch(addToCart(itemToAdd));
        
        // No need to update the product's stock locally
        // This should be handled by the backend when orders are finalized
        
        alert('Product added to cart successfully!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart. Please try again.');
      }
    }
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };
  
  const handleIncreaseQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // Render star rating
  const renderRating = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} />);
    }
    
    return stars;
  };
  
  // Format price with commas for Indian Rupees
  const formatPrice = (price = 0) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Function to get processed image URL
  const getProcessedImageUrl = (imgUrl) => {
    if (!imgUrl) return '/images/placeholder.png';
    
    try {
      // Get API base URL without /api path
      const apiBaseUrl = API_URL.replace('/api', '');
      
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
        return `${apiBaseUrl}${imgUrl.replace('/uploads/uploads/', '/uploads/')}`;
      }
      
      // Check if URL starts with /uploads
      if (imgUrl.startsWith('/uploads/')) {
        return `${apiBaseUrl}${imgUrl}`;
      }
      
      // Check if URL contains cloudinary
      if (imgUrl.includes('cloudinary.com')) {
        return imgUrl.startsWith('http') ? imgUrl : `https://${imgUrl.replace(/^\/\//, '')}`;
      }
      
      // Check if URL is a relative path
      if (imgUrl.startsWith('/')) {
        return `${window.location.origin}${imgUrl}`;
      }
      
      // If URL includes uploads directory
      if (imgUrl.includes('uploads')) {
        // Extract just the filename if it's a full path
        const filename = imgUrl.split('/').pop();
        return `${apiBaseUrl}/uploads/${filename}`;
      }
      
      // If it's just a filename with no path indicators,
      // try checking in the public/images directory first
      return `${window.location.origin}/images/${imgUrl}`;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return '/images/placeholder.png';
    }
  };
  
  // Function to handle image errors
  const handleImageError = (event) => {
    console.log('Image failed to load:', event.target.src);
    event.target.onerror = null;
    event.target.src = '/images/placeholder.png';
  };
  
  // Handle user rating
  const handleRatingClick = async (rating) => {
    // If user has already rated, don't allow them to rate again
    if (userRating > 0) {
      alert("You have already rated this product!");
      return;
    }
    
    try {
      // Try to save rating to backend first
      try {
        console.log(`Submitting rating ${rating} for product ${id}`);
        await productRatingAPI.rateProduct(id, rating);
        
        // If successful, update UI
        setUserRating(rating);
        
        // Update the product rating
        const newRating = product.rating ? (product.rating * 0.8 + rating * 0.2) : rating;
        setProduct({
          ...product,
          rating: newRating
        });
        
        alert(`Thank you for rating this product ${rating} stars!`);
      } catch (apiError) {
        console.error('API Error saving rating:', apiError);
        
        // If API fails (like user not logged in), fallback to local storage
        if (apiError.message.includes('Authentication required')) {
          alert('Please log in to rate products. Your rating will be saved locally for now.');
          
          // Save to localStorage as backup
          setUserRating(rating);
          
          // Update product rating locally
          const newRating = product.rating ? (product.rating * 0.8 + rating * 0.2) : rating;
          setProduct({
            ...product,
            rating: newRating
          });
          
          // Store in localStorage to prevent multiple ratings from same user
          const ratedProducts = JSON.parse(localStorage.getItem('ratedProducts') || '{}');
          ratedProducts[product._id] = rating;
          localStorage.setItem('ratedProducts', JSON.stringify(ratedProducts));
        } else {
          throw apiError; // Re-throw for the catch block below
        }
      }
    } catch (error) {
      console.error('Error saving rating:', error);
      alert('Failed to save your rating. Please try again later.');
    }
  };
  
  // Interactive rating component
  const renderInteractiveRating = () => {
    return (
      <div className={styles.interactiveRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            {star <= (hoverRating || userRating) ? (
              <FaStar className={styles.starActive} />
            ) : (
              <FaRegStar className={styles.starInactive} />
            )}
          </span>
        ))}
        {userRating > 0 && <span className={styles.ratingText}>You rated this {userRating} stars</span>}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading product details...</div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error || 'Product not found'}</div>
        <button className={styles.backButton} onClick={() => navigate('/products')}>
          <FaArrowLeft /> Back to Products
        </button>
      </div>
    );
  }
  
  // SafeGet function to handle potential undefined values
  const safeGet = (obj, path, defaultValue = '') => {
    try {
      return path.split('.').reduce((o, key) => (o || {})[key], obj) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };
  
  return (
    <div className={styles.productDetail}>
      <div className="container">
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        
        <div className={styles.productContainer}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={getProcessedImageUrl(product.images[selectedImage])} 
                  alt={product.name}
                  onError={handleImageError}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <FaImage />
                  <span>No image available</span>
                </div>
              )}
              <button 
                className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
                onClick={toggleFavorite}
                aria-label="Add to favorites"
              >
                <BsHeartFill />
              </button>
              
              {product.images && product.images.length > 1 && (
                <>
                  <button 
                    className={`${styles.imageNavBtn} ${styles.prevBtn}`}
                    onClick={() => setSelectedImage((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1))}
                    aria-label="Previous image"
                  >
                    <IoIosArrowDropleftCircle />
                  </button>
                  <button 
                    className={`${styles.imageNavBtn} ${styles.nextBtn}`}
                    onClick={() => setSelectedImage((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1))}
                    aria-label="Next image"
                  >
                    <IoIosArrowDroprightCircle />
                  </button>
                </>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={getProcessedImageUrl(img)} 
                      alt={`${product.name} - view ${index + 1}`}
                      onError={handleImageError} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.infoSection}>
            <h1 className={styles.productName}>{product.name}</h1>
            
            <div className={styles.meta}>
              <div className={styles.rating}>
                {userRating > 0 ? (
                  <>
                    <span className={styles.ratedBadge}>Your Rating: {userRating}/5</span>
                  </>
                ) : (
                  <>
                    <span className={styles.ratePrompt}>Rate this product</span>
                  </>
                )}
              </div>
              
              <p className={styles.stock}>
                {product.stock > 0 
                  ? `In Stock (${product.stock} available)` 
                  : 'Out of Stock'}
              </p>
            </div>
            
            <div className={styles.ratingSection}>
              {renderInteractiveRating()}
              {userRating > 0 && <p className={styles.ratedMessage}>You've already rated this product</p>}
            </div>
            
            <p className={styles.price}>₹{formatPrice(product.price)}</p>
            
            {/* <div className={styles.artisan}>
              <p>Crafted by <span>{product.artisan || 'Unknown Artisan'}</span> from the <span>{product.tribe || 'Unknown'}</span> tribe</p>
              <p>Region: <span>{product.region || 'Unknown Region'}</span></p>
            </div> */}
            
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>
            
            <div className={styles.actions}>
              <div className={styles.quantity}>
                <button 
                  className={styles.quantityBtn} 
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button 
                  className={styles.quantityBtn} 
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              
              <button 
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
            
            <div className={styles.shipping}>
              <p>Free shipping on orders over ₹2,000</p>
              <p>Expected delivery: 5-7 business days</p>
            </div>
          </div>
        </div>
        
        <div className={styles.additionalInfo}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'Details' ? styles.active : ''}`} onClick={() => setActiveTab('Details')}>Details</button>
            <button className={`${styles.tab} ${activeTab === 'Specifications' ? styles.active : ''}`} onClick={() => setActiveTab('Specifications')}>Specifications</button>
            <button className={`${styles.tab} ${activeTab === 'Shipping & Returns' ? styles.active : ''}`} onClick={() => setActiveTab('Shipping & Returns')}>Shipping & Returns</button>
          </div>
          
          <div className={styles.tabContent}>
            {activeTab === 'Details' && (
              <>
                <h3>Product Details</h3>
                <p>
                  Each piece is handcrafted with traditional techniques passed down through generations.
                  The materials used are ethically sourced from the local environment, ensuring
                  sustainability and authenticity.
                </p>
                <p>
                  Due to the handmade nature of this product, slight variations in color, size, and pattern may occur,
                  making each piece unique.
                </p>
                <h4>Care Instructions</h4>
                <ul>
                  <li>Clean with a soft, dry cloth</li>
                  <li>Avoid direct sunlight and extreme temperatures</li>
                  <li>Store in a cool, dry place when not in use</li>
                </ul>
              </>
            )}
            {activeTab === 'Specifications' && (
              <>
                <h3>Specifications</h3>
                <ul>
                  <li>Material: {product.material || 'Handcrafted materials'}</li>
                  <li>Dimensions: {product.dimensions || 'Varies'}</li>
                  <li>Weight: {product.weight || 'Varies'}</li>
                  <li>Color: {product.color || 'Natural'}</li>
                </ul>
              </>
            )}
            {activeTab === 'Shipping & Returns' && (
              <>
                <h3>Shipping & Returns</h3>
                <p>Free shipping on orders over ₹2,000. Expected delivery: 5-7 business days.</p>
                <p>Returns are accepted within 30 days of delivery. Please contact customer service for return instructions.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 