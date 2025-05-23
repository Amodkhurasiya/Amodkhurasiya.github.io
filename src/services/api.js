import axios from 'axios';
import { API_URL } from '../utils/env';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle session expiration
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication error detected:', error.response.status);
      
      // Check if this is a token-related error
      const errorMsg = error.response.data?.message || '';
      if (
        errorMsg.toLowerCase().includes('token') || 
        errorMsg.toLowerCase().includes('auth') || 
        errorMsg.toLowerCase().includes('expire') ||
        error.response.status === 401 ||
        error.response.status === 403
      ) {
        console.warn('Token-related error detected, clearing auth state');
        
        // Clear auth data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login only if we're in admin panel
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Fallback function to get products from local static file when API is down
const getLocalFallbackProducts = async () => {
  try {
    const response = await fetch('/products.json');
    if (!response.ok) {
      throw new Error('Failed to load local products');
    }
    const data = await response.json();
    // Ensure we return an array
    return Array.isArray(data) ? data : 
           (data && Array.isArray(data.products)) ? data.products : [];
  } catch (fallbackError) {
    console.error('Error loading fallback products:', fallbackError);
    // Last resort static data - ensure it's an array
    return [
      {
        id: "fallback1",
        name: "Traditional Tribal Art",
        price: 1500,
        description: "Handmade tribal art piece - static fallback",
        images: ["https://i.ibb.co/PMR4DJz/gond-art.jpg"],
        category: "art",
        stock: 5,
        rating: 4.5
      }
    ];
  }
};

// Product related API calls
export const productAPI = {
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      
      // Ensure we're returning an array of products
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        return response.data.products;
      } else {
        console.warn('API response format unexpected:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      console.log('Falling back to local products data');
      const fallbackData = await getLocalFallbackProducts();
      
      // Ensure we're returning an array from the fallback
      if (Array.isArray(fallbackData)) {
        return fallbackData;
      } else if (fallbackData && Array.isArray(fallbackData.products)) {
        return fallbackData.products;
      } else {
        console.warn('Fallback data format unexpected:', fallbackData);
        return [];
      }
    }
  },
  
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      // Try to find the product in the fallback data
      const fallbackData = await getLocalFallbackProducts();
      const product = fallbackData.products.find(p => p.id === id);
      if (product) {
        return { data: product };
      }
      throw error;
    }
  },
  
  getCategories: async () => {
    try {
      return { data: ['Handicrafts', 'Textiles', 'Jewelry', 'Paintings', 'Forest Goods'] };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      const response = await apiClient.get(`/products/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      // Fall back to local filtering
      const fallbackData = await getLocalFallbackProducts();
      const filteredProducts = fallbackData.products.filter(
        p => p.name.toLowerCase().includes(query.toLowerCase()) || 
             p.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        success: true,
        products: filteredProducts
      };
    }
  },
  
  getProductsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      // Fall back to local filtering by category
      const fallbackData = await getLocalFallbackProducts();
      const filteredProducts = fallbackData.products.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
      return {
        success: true,
        products: filteredProducts
      };
    }
  },
};

// Authentication related API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('Login attempt with credentials:', { 
        email: credentials.email, 
        isAdmin: credentials.isAdmin 
      });
      
      // Determine endpoint based on whether it's an admin login
      const endpoint = credentials.isAdmin ? '/auth/admin-login' : '/auth/login';
      const response = await apiClient.post(endpoint, credentials);
      
      console.log('Login response:', response.data);
      
      // For admin login, check if the user has admin role
      if (credentials.isAdmin && response.data.user && response.data.user.role !== 'admin') {
        console.error('User tried admin login but lacks admin role');
        throw new Error('Access denied. Admin privileges required');
      }
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        data: {
          user: response.data.user,
          token: response.data.token
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Enhance error handling for admin login failures
      if (credentials.isAdmin && error.response && error.response.status === 403) {
        throw new Error('Access denied. Admin privileges required');
      }
      
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        data: {
          user: response.data.user,
          token: response.data.token
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  registerAdmin: async (data) => {
    try {
      const response = await apiClient.post('/auth/register-admin', data);
      
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        data: {
          user: response.data.user,
          token: response.data.token
        }
      };
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  },
  
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Don't try to validate the token since the endpoint doesn't exist yet
      // Just check if we have a token - actual validation will happen on API requests
      return { valid: true };
    } catch (error) {
      console.error('Token validation error:', error);
      // Remove invalid token
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Request password reset
  forgotPassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Validate reset token
  validateResetToken: async (token) => {
    try {
      const response = await apiClient.get(`/auth/reset-password/${token}/validate`);
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (data) => {
    try {
      const response = await apiClient.post(`/auth/reset-password/${data.token}`, {
        email: data.email,
        password: data.password
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
};

// User related API calls
export const userAPI = {
  // Get user profile information
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile data');
      }

      const data = await response.json();
      
      // Store user data in localStorage for offline access
      localStorage.setItem('user', JSON.stringify(data));
      
      return { data };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile information
  updateUserProfile: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      console.log('Sending profile update with data:', userData);

      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(data));
      
      return { data };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Change user password
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      return { data: await response.json() };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/users/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return { data: await response.json() };
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
};

// Order related API calls
export const orderAPI = {
  // Get all orders for the current user
  getOrderHistory: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/orders/my-orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get order history');
      }

      return { data: await response.json() };
    } catch (error) {
      console.error('Error getting order history:', error);
      throw error;
    }
  },

  // Get details of a specific order
  getOrderDetails: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get order details');
      }

      return { data: await response.json() };
    } catch (error) {
      console.error(`Error getting order details for ${orderId}:`, error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    console.log("Creating order with data:", orderData);
    
    // Map frontend payment methods to backend expected formats
    const paymentMethodMap = {
      'credit_card': 'credit_card',
      'paypal': 'paypal',
      'upi': 'upi',
      'cod': 'cash_on_delivery' // This is the key fix - backend expects 'cash_on_delivery'
    };
    
    // Update the payment method format
    const formattedOrderData = {
      ...orderData,
      paymentMethod: paymentMethodMap[orderData.paymentMethod] || orderData.paymentMethod
    };
    
    console.log("Order with formatted payment method:", formattedOrderData);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return { success: false, error: 'Authentication required. Please log in.' };
      }
      
      // Validate payment method
      const validPaymentMethods = ['credit_card', 'paypal', 'upi', 'cash_on_delivery'];
      const mappedPaymentMethod = formattedOrderData.paymentMethod;
      
      if (!validPaymentMethods.includes(mappedPaymentMethod)) {
        console.error('Invalid payment method:', mappedPaymentMethod);
        return { 
          success: false, 
          error: `Invalid payment method: ${mappedPaymentMethod}. Please select from: Credit Card, PayPal, UPI, or Cash on Delivery.` 
        };
      }
      
      // Use baseURL from apiClient or imported env var
      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedOrderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Order creation failed:', errorData);
        return { success: false, error: errorData.message || 'Failed to create order' };
      }
      
      const responseData = await response.json();
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error in createOrder:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
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

// Product Rating API
export const productRatingAPI = {
  // Rate a product
  rateProduct: async (productId, rating) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required to rate products');
      }

      console.log(`Sending rating ${rating} for product ${productId}`);
      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/products/${productId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save rating');
      }

      return await response.json();
    } catch (error) {
      console.error('Error rating product:', error);
      throw error;
    }
  },

  // Get user's rating for a product
  getUserRating: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null; // User not logged in, no ratings
      }

      console.log(`Fetching user rating for product ${productId}`);
      const apiUrl = import.meta.env.VITE_API_URL || API_URL;
      const response = await fetch(`${apiUrl}/products/${productId}/userRating`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('No rating found for this user/product');
          return null; // User hasn't rated this product
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user rating');
      }

      const data = await response.json();
      console.log('User rating fetched successfully:', data);
      return data.rating;
    } catch (error) {
      console.error('Error fetching user rating:', error);
      return null;
    }
  }
};

// Mock functions for development

// Mock login function
const mockLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'user@example.com' && credentials.password === 'password') {
        const user = {
          id: 1,
          name: 'Test User',
          email: credentials.email,
          avatar: 'https://i.pravatar.cc/150?img=1',
        };
        
        const token = 'mock-jwt-token';
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        resolve({ data: { user, token } });
      } else {
        reject({ response: { data: { message: 'Invalid credentials' } } });
      }
    }, 500);
  });
};

// Mock register function
const mockRegister = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: 1,
        name: userData.name,
        email: userData.email,
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
      
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      resolve({ data: { user, token } });
    }, 500);
  });
};

// Mock products data
const getMockProducts = () => {
  return Promise.resolve([
    // Mock products data here
  ]);
};

// API Functions
export const fetchFeaturedProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};

export const fetchCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};

export const fetchProductsByCategory = (categorySlug) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
};

export const fetchProductById = (productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Product not found'));
    }, 500);
  });
};

export const fetchProductBySlug = (productSlug) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Product not found'));
    }, 500);
  });
};

export const searchProducts = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500);
  });
}; 