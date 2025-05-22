import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Order related API calls
const orderAPI = {
  createOrder: async (orderData) => {
    try {
      console.log('Creating order with data:', orderData);
      
      // Map frontend payment methods to backend expected formats
      const paymentMethodMap = {
        'credit-card': 'credit-card',
        'paypal': 'paypal',
        'upi': 'upi',
        'cod': 'cash_on_delivery'
      };
      
      // Update payment method to match backend format
      const updatedOrderData = {
        ...orderData,
        paymentMethod: paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod
      };
      
      console.log('Sending order with payment method:', updatedOrderData.paymentMethod);
      
      // Send to server
      const response = await apiClient.post('/orders', updatedOrderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  getOrderHistory: async () => {
    try {
      const response = await apiClient.get('/orders');
      return response;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  },
  
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },
};

export default orderAPI; 