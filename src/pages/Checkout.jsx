import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { FaArrowLeft, FaRegCreditCard, FaPaypal, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';
import styles from './Checkout.module.css';
import orderAPI from '../services/orderAPI';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user, token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentError, setPaymentError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'credit-card',
    // Credit Card fields
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    // UPI fields
    upiId: '',
    // No additional fields needed for COD
  });

  useEffect(() => {
    console.log("Cart items in checkout:", items);
    console.log("Cart total in checkout:", totalAmount);
    
    // Get discount from localStorage
    const savedDiscount = localStorage.getItem('cartDiscount');
    if (savedDiscount) {
      setDiscount(parseFloat(savedDiscount));
    }
    
    // Pre-fill email if user is logged in
    if (user && user.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        phone: user.phone || ''
      }));
    }
    
    // Redirect to cart if cart is empty
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [user, navigate, items, totalAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear payment-specific errors when changing payment method
    if (name === 'paymentMethod') {
      setPaymentError('');
    }
  };

  // Calculate final total with shipping and discount
  const calculateFinalTotal = () => {
    const shippingCost = totalAmount > 2000 ? 0 : 150;
    return totalAmount + shippingCost - discount;
  };

  // Format price with commas for Indian Rupees
  const formatPrice = (price) => {
    if (!price && price !== 0) return "₹0";
    return "₹" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate shipping information
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    // Validate payment information based on selected method
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.cardName.trim()) newErrors.cardName = 'Card holder name is required';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = 'Invalid CVV';
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId.trim()) newErrors.upiId = 'UPI ID is required';
      else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(formData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g., name@upi)';
      }
    }
    
    setPaymentError(Object.values(newErrors).join('\n') || '');
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!items || items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    if (!token) {
      setError('You must be logged in to place an order');
      navigate('/login?redirect=/checkout');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Calculate the final total with discount
      const finalTotal = calculateFinalTotal();
      
      // Format order data for the API
      const orderData = {
        items: items.map(item => {
          // Ensure each item has proper data
          const productId = item._id || item.id;
          
          if (!productId) {
            throw new Error(`Invalid product ID for item: ${item.name || 'Unknown product'}`);
          }
          
          // Ensure we have a valid image URL
          let imageUrl = item.image;
          if (!imageUrl && item.images && item.images.length > 0) {
            imageUrl = item.images[0];
          }
          
          return {
            product: productId,
            quantity: item.quantity || 1,
            price: item.price || 0,
            name: item.name || 'Unknown Product',
            image: imageUrl || ''
          };
        }),
        totalAmount: finalTotal || 0, // Use the final total with discount applied
        originalAmount: totalAmount || 0,
        discount: discount || 0,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod, // This will be mapped to the correct format in the API service
        paymentDetails: getPaymentDetails()
      };
      
      console.log('Submitting order with payment method:', formData.paymentMethod);
      
      try {
        // Use orderAPI instead of direct fetch to ensure proper payment method mapping
        const response = await orderAPI.createOrder(orderData);
        
        // Clear the cart and discount in localStorage
      dispatch(clearCart());
        localStorage.removeItem('cartDiscount');
      
      // Show success message and redirect
        alert('Order placed successfully! Your order ID is ' + response.data._id);
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place order. Please try again later.');
      }
    } catch (error) {
      console.error('Error preparing order data:', error);
      setError(error.message || 'Failed to process order data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get payment details based on selected payment method
  const getPaymentDetails = () => {
    switch (formData.paymentMethod) {
      case 'credit-card':
        return {
          cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4), // Only store last 4 digits for security
          cardName: formData.cardName,
          cardExpiry: formData.cardExpiry
        };
      case 'upi':
        return {
          upiId: formData.upiId
        };
      case 'cod': // Frontend uses 'cod', backend expects 'cash_on_delivery'
        return {
          codInstructions: 'Cash payment to be collected upon delivery'
        };
      default:
        return {};
    }
  };

  // Render payment method specific fields
  const renderPaymentFields = () => {
    switch (formData.paymentMethod) {
      case 'credit-card':
        return (
          <div className={styles.paymentFields}>
            <div className={styles.formField}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className={styles.formField}>
              <label htmlFor="cardName">Name on Card</label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label htmlFor="cardExpiry">Expiry Date</label>
                <input
                  type="text"
                  id="cardExpiry"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  value={formData.cardExpiry}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="cardCvv">CVV</label>
                <input
                  type="text"
                  id="cardCvv"
                  name="cardCvv"
                  placeholder="123"
                  maxLength="3"
                  value={formData.cardCvv}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        );
      
      case 'upi':
        return (
          <div className={styles.paymentFields}>
            <div className={styles.formField}>
              <label htmlFor="upiId">UPI ID</label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                placeholder="name@upi"
                value={formData.upiId}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <p className={styles.paymentInfo}>
              You will receive a payment request on your UPI app after placing the order.
            </p>
          </div>
        );
      
      case 'cod':
        return (
          <div className={styles.paymentFields}>
            <p className={styles.paymentInfo}>
              Pay with cash upon delivery. Please ensure that you have the exact amount ready when your package arrives.
            </p>
            {calculateFinalTotal() > 5000 && (
              <p className={styles.codWarning}>
                Note: Cash on Delivery is limited to orders under ₹5,000. For your order of {formatPrice(calculateFinalTotal())}, we recommend using another payment method.
              </p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <div className={styles.formLeft}>
          <div className={styles.section}>
            <h2>Shipping Information</h2>
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                      <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formField}>
                      <label htmlFor="lastName">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
                <div className={styles.formRow}>
            <div className={styles.formField}>
                    <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="phone">Phone Number*</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
            </div>
            
            <div className={styles.formField}>
                  <label htmlFor="address">Address*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                    <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className={styles.formField}>
                    <label htmlFor="state">State*</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formField}>
                    <label htmlFor="postalCode">Postal Code*</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className={styles.formField}>
                    <label htmlFor="country">Country*</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="India">India</option>
                      <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className={styles.section}>
            <h2>Payment Method</h2>
            <div className={styles.paymentOptions}>
                  <div className={`${styles.paymentOption} ${formData.paymentMethod === 'credit-card' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  id="credit-card"
                  name="paymentMethod"
                  value="credit-card"
                  checked={formData.paymentMethod === 'credit-card'}
                  onChange={handleChange}
                  disabled={loading}
                />
                    <label htmlFor="credit-card">
                      <FaRegCreditCard className={styles.paymentIcon} />
                      Credit / Debit Card
                    </label>
              </div>
                  
                  <div className={`${styles.paymentOption} ${formData.paymentMethod === 'paypal' ? styles.selected : ''}`}>
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  disabled={loading}
                />
                    <label htmlFor="paypal">
                      <FaPaypal className={styles.paymentIcon} />
                      PayPal
                    </label>
                  </div>
                  
                  <div className={`${styles.paymentOption} ${formData.paymentMethod === 'upi' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label htmlFor="upi">
                      <FaMobileAlt className={styles.paymentIcon} />
                      UPI
                    </label>
                  </div>
                  
                  <div className={`${styles.paymentOption} ${formData.paymentMethod === 'cod' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      disabled={loading || calculateFinalTotal() > 5000}
                    />
                    <label htmlFor="cod" className={calculateFinalTotal() > 5000 ? styles.disabled : ''}>
                      <FaMoneyBillWave className={styles.paymentIcon} />
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                
                {paymentError && <div className={styles.paymentError}>{paymentError}</div>}
                
                {renderPaymentFields()}
            </div>
          </div>
          
            <div className={styles.formRight}>
              <div className={styles.orderSummaryContainer}>
                <div className={styles.section}>
            <h2>Order Summary</h2>
                  <div className={styles.orderSummaryItems}>
                    {items.map(item => (
                      <div key={item.id} className={styles.summaryItem}>
                        <div className={styles.summaryItemInfo}>
                          <span className={styles.itemQuantity}>{item.quantity} ×</span>
                          <span className={styles.itemName}>{item.name}</span>
                        </div>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderDetails}>
                    <div className={styles.orderItem}>
                      <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    
                    <div className={styles.orderItem}>
                      <span>Shipping</span>
                      <span>
                        {totalAmount > 2000 
                          ? 'Free' 
                          : formatPrice(150)}
                      </span>
                    </div>
                    
                    {discount > 0 && (
                      <div className={`${styles.orderItem} ${styles.discount}`}>
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className={styles.orderTotal}>
                      <span>Total</span>
                      <span>{formatPrice(calculateFinalTotal())}</span>
                    </div>
            </div>
          </div>
          
            <button 
              type="submit" 
                  className={styles.placeOrderBtn}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
                
                <button 
                  type="button" 
                  className={styles.backToCartBtn}
                  onClick={() => navigate('/cart')}
                  disabled={loading}
                >
                  <FaArrowLeft /> Back to Cart
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 