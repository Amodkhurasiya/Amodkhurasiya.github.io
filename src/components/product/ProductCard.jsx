import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const [isHovered, setIsHovered] = useState(false);
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
  };
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }));
    }
  };
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar key={i} className={i < rating ? styles.starFilled : styles.starEmpty} />
    ));
  };

  return (
    <motion.div 
      className={styles.productCard}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.productImage} />
          
          {product.discount > 0 && (
            <span className={styles.discountBadge}>-{product.discount}%</span>
          )}
          
          {product.isNew && (
            <span className={styles.newBadge}>New</span>
          )}
          
          <div className={`${styles.actions} ${isHovered ? styles.visible : ''}`}>
            <button 
              className={styles.actionBtn} 
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <FaShoppingCart />
            </button>
            <button 
              className={`${styles.actionBtn} ${isInWishlist ? styles.active : ''}`} 
              onClick={handleToggleWishlist}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isInWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
            <Link 
              to={`/product/${product.id}`} 
              className={styles.actionBtn}
              onClick={(e) => e.stopPropagation()}
              aria-label="View product details"
            >
              <FaEye />
            </Link>
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <div className={styles.productMeta}>
            <span className={styles.category}>{product.category}</span>
            <div className={styles.rating}>
              {renderStars(product.rating)}
            </div>
          </div>
          
          <h3 className={styles.productName}>{product.name}</h3>
          
          <div className={styles.tribe}>
            <span className={styles.tribeLabel}>Tribe:</span> {product.tribe || 'Various'}
          </div>
          
          <div className={styles.priceContainer}>
            {product.discount > 0 ? (
              <>
                <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 