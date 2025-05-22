import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart, 
  removeFromCart, 
  decreaseQuantity, 
  clearCart 
} from '../redux/slices/cartSlice';
import { FaTrash, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import styles from './Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [stockWarning, setStockWarning] = useState('');
  
  // Shipping cost calculation (free shipping over 2000)
  const shippingCost = totalAmount > 2000 ? 0 : 150;
  
  // Final total calculation
  const finalTotal = totalAmount + shippingCost - discount;
  
  // Format price with commas for Indian Rupees
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Handle quantity increase
  const handleIncrease = (item) => {
    // Check if item has a stock limit and if current quantity is at that limit
    if (item.stock && item.quantity >= item.stock) {
      setStockWarning(`Sorry, only ${item.stock} units of "${item.name}" are available`);
      setTimeout(() => setStockWarning(''), 3000); // Clear warning after 3 seconds
      return;
    }
    
    // Make a copy of the item without quantity (to avoid doubling)
    const itemToAdd = {
      ...item,
      quantity: 1 // Explicitly set quantity to 1 to avoid doubling
    };
    
    // If no stock limit or within limit, add to cart
    dispatch(addToCart(itemToAdd));
    setStockWarning('');
  };
  
  // Handle quantity decrease
  const handleDecrease = (id) => {
    dispatch(decreaseQuantity(id));
    setStockWarning('');
  };
  
  // Handle removing item from cart
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    setStockWarning('');
  };
  
  // Handle clearing the entire cart
  const handleClearCart = () => {
    setShowConfirmClear(false);
    dispatch(clearCart());
    setStockWarning('');
  };
  
  // Handle applying coupon code
  const handleApplyCoupon = () => {
    setCouponError('');
    
    // Mock coupon codes for demonstration
    if (couponCode.toUpperCase() === 'TRIBAL20') {
      const discountAmount = totalAmount * 0.2; // 20% discount
      setDiscount(discountAmount);
    } else if (couponCode.toUpperCase() === 'WELCOME10') {
      const discountAmount = totalAmount * 0.1; // 10% discount
      setDiscount(discountAmount);
    } else {
      setCouponError('Invalid coupon code');
      setDiscount(0);
    }
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    if (isAuthenticated) {
      // Store discount information in localStorage before navigating
      if (discount > 0) {
        localStorage.setItem('cartDiscount', discount.toString());
      } else {
        localStorage.removeItem('cartDiscount');
      }
      
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };
  
  return (
    <div className={styles.cartPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Your Shopping Cart</h1>
        
        {stockWarning && (
          <div className={styles.stockWarning}>
            {stockWarning}
          </div>
        )}
        
        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyMessage}>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any products to your cart yet.</p>
              <Link to="/products" className={styles.continueShopping}>
                <FaArrowLeft /> Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              <div className={styles.cartHeader}>
                <div className={styles.headerProduct}>Product</div>
                <div className={styles.headerPrice}>Price</div>
                <div className={styles.headerQuantity}>Quantity</div>
                <div className={styles.headerTotal}>Total</div>
                <div className={styles.headerAction}></div>
              </div>
              
              {items.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.productInfo}>
                    <div className={styles.productImage}>
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className={styles.productDetails}>
                      <Link to={`/product/${item.id}`} className={styles.productName}>
                        {item.name}
                      </Link>
                      <p className={styles.productMeta}>
                        By artisans from {item.tribe} tribe
                      </p>
                      {item.stock && (
                        <p className={styles.stockInfo}>
                          {item.quantity >= item.stock ? (
                            <span className={styles.stockLimit}>Max stock reached</span>
                          ) : (
                            <span>In stock: {item.stock}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.productPrice}>
                    ₹{formatPrice(item.price)}
                  </div>
                  
                  <div className={styles.quantityControl}>
                    <button 
                      className={styles.quantityBtn}
                      onClick={() => handleDecrease(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button 
                      className={styles.quantityBtn}
                      onClick={() => handleIncrease(item)}
                      disabled={item.stock && item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className={styles.productTotal}>
                    ₹{formatPrice(item.price * item.quantity)}
                  </div>
                  
                  <div className={styles.removeAction}>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className={styles.cartActions}>
                <Link to="/products" className={styles.continueShopping}>
                  <FaArrowLeft /> Continue Shopping
                </Link>
                
                <button 
                  className={styles.clearCartBtn}
                  onClick={() => setShowConfirmClear(true)}
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className={styles.cartSummary}>
              <h2>Order Summary</h2>
              
              <div className={styles.summaryItem}>
                <span>Subtotal ({totalQuantity} items)</span>
                <span>₹{formatPrice(totalAmount)}</span>
              </div>
              
              <div className={styles.summaryItem}>
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 
                    ? 'Free' 
                    : `₹${formatPrice(shippingCost)}`}
                </span>
              </div>
              
              {discount > 0 && (
                <div className={`${styles.summaryItem} ${styles.discount}`}>
                  <span>Discount</span>
                  <span>-₹{formatPrice(discount)}</span>
                </div>
              )}
              
              <div className={styles.couponSection}>
                <h3>Apply Coupon</h3>
                <div className={styles.couponForm}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className={styles.couponError}>{couponError}</p>}
                <p className={styles.couponHint}>
                  <FaInfoCircle /> Try using "TRIBAL20" for 20% off
                </p>
              </div>
              
              <div className={styles.totalSection}>
                <div className={styles.orderTotal}>
                  <span>Total</span>
                  <span>₹{formatPrice(finalTotal)}</span>
                </div>
                <p className={styles.taxInfo}>
                  Including GST and all applicable taxes
                </p>
              </div>
              
              <button 
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                data-testid="checkout-button"
              >
                Proceed to Checkout
              </button>
              
              <div className={styles.secureCheckout}>
                <p>Secure Checkout</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Confirm Clear Cart Modal */}
      {showConfirmClear && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Clear Shopping Cart</h3>
            <p>Are you sure you want to remove all items from your cart?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleClearCart}
              >
                Yes, Clear Cart
              </button>
            </div>
          </div>
          <div 
            className={styles.modalOverlay}
            onClick={() => setShowConfirmClear(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Cart; 