import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaImage } from 'react-icons/fa';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState('/images/placeholder.png');
  const dispatch = useDispatch();
  
  const { _id, id, name, price, images, tribe, rating } = product;
  const productId = _id || id;
  
  // Function to handle adding product to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      ...product,
      id: productId,
      image: imageSrc || '/images/placeholder.png'
    }));
  };
  
  // Handle image error
  const handleImageError = () => {
    console.log('Image failed to load:', imageSrc);
    setImageError(true);
    setImageSrc('/images/placeholder.png');
  };
  
  // Process the image source when component mounts or images change
  useEffect(() => {
    // Reset error state when images change
    setImageError(false);
    
    // Initialize with placeholder
    let processedImageUrl = '/images/placeholder.png';
    
    try {
      // Process image URL if available
      if (product && product.images) {
        processedImageUrl = getProductImage();
        console.log(`Processed image URL for ${name}: ${processedImageUrl}`);
      }
    } catch (err) {
      console.error(`Error setting image for product ${name}:`, err);
      setImageError(true);
    }
    
    setImageSrc(processedImageUrl);
  }, [images, product, name]);
  
  // Get product image
  const getProductImage = () => {
    if (imageError) {
      return '/images/placeholder.png';
    }
    
    // If images array exists and has items
    if (images && Array.isArray(images) && images.length > 0) {
      // Get the first non-null image URL
      let imgUrl = null;
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          imgUrl = images[i];
          break;
        }
      }
      
      // If no valid image found
      if (!imgUrl) {
        console.log(`No valid image URL found for product: ${name}`);
        return '/images/placeholder.png';
      }
      
      console.log(`Raw image URL for ${name}:`, imgUrl);
      
      // Handle direct file uploads which are stored in /uploads
      if (typeof imgUrl === 'string') {
        try {
          // Check for data URLs (base64 encoded images)
          if (imgUrl.startsWith('data:image/')) {
            return imgUrl;
          }
          
          // Check if URL is already absolute (has http or https)
          if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
            return imgUrl;
          }
          
          // Check if URL starts with // (protocol-relative URL)
          if (imgUrl.startsWith('//')) {
            return `https:${imgUrl}`;
          }
          
          // Handle duplicate uploads path issue
          if (imgUrl.startsWith('/uploads/uploads/')) {
            return `http://localhost:5000${imgUrl.replace('/uploads/uploads/', '/uploads/')}`;
          }
          
          // Check if URL starts with /uploads which is how backend stores images
          if (imgUrl.startsWith('/uploads/')) {
            return `http://localhost:5000${imgUrl}`;
          }
          
          // Check if URL contains cloudinary
          if (imgUrl.includes('cloudinary.com')) {
            if (imgUrl.startsWith('http')) {
              return imgUrl;
            } else {
              return `https://${imgUrl.replace(/^\/\//, '')}`;
            }
          }
          
          // Check if URL is a relative path starting with /
          if (imgUrl.startsWith('/')) {
            return `${window.location.origin}${imgUrl}`;
          }
          
          // Check if the URL includes 'uploads' directory (common pattern in the logs)
          if (imgUrl.includes('uploads')) {
            // Extract just the filename if it's a full path
            const filename = imgUrl.split('/').pop();
            return `http://localhost:5000/uploads/${filename}`;
          }
          
          // If it's just a filename, assume it's in the public/images folder
          return `${window.location.origin}/images/${imgUrl}`;
        } catch (error) {
          console.error('Error processing image URL:', error);
          return '/images/placeholder.png';
        }
      }
    }
    
    // Use product.image as fallback if it exists
    if (product && product.image && typeof product.image === 'string') {
      return product.image;
    }
    
    console.log(`Using placeholder for product: ${name}`);
    return '/images/placeholder.png';
  };
  
  // Render star rating
  const renderRating = (rating) => {
    if (!rating && rating !== 0) return null;
    
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
  const formatPrice = (price) => {
    if (!price && price !== 0) return "₹0";
    return "₹" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  if (!product) return null;
  
  return (
    <div 
      className={styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${productId}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          {imageError ? (
            <div className={styles.placeholderImage}>
              <FaImage />
              <span>Image not available</span>
            </div>
          ) : (
            <img 
              src={imageSrc} 
              alt={name} 
              className={styles.productImage} 
              onError={handleImageError}
            />
          )}
          
          <div className={`${styles.overlay} ${isHovered ? styles.showOverlay : ''}`}>
            <button 
              className={styles.quickAddBtn}
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <FaShoppingCart /> Quick Add
            </button>
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{name}</h3>
          {tribe && <p className={styles.productTribe}>By artisans from {tribe} tribe</p>}
          
          <div className={styles.ratingPrice}>
            <div className={styles.rating}>
              {rating ? renderRating(rating) : null}
            </div>
            <p className={styles.price}>{formatPrice(price)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 