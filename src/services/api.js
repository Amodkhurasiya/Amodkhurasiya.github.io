import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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

// Product related API calls
export const productAPI = {
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
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
      throw error;
    }
  },
  
  getProductsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
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

      const response = await fetch('http://localhost:5000/api/users/profile', {
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

      const response = await fetch('http://localhost:5000/api/users/profile', {
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

      const response = await fetch('http://localhost:5000/api/users/change-password', {
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

      const response = await fetch('http://localhost:5000/api/users/delete-account', {
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

      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
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

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
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
      
      const response = await fetch(`${API_URL}/orders`, {
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
      const response = await fetch(`http://localhost:5000/api/products/${productId}/rate`, {
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
      const response = await fetch(`http://localhost:5000/api/products/${productId}/userRating`, {
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
    {
      id: 1,
      name: 'Tribal Pot',
      description: 'Beautiful handcrafted necklace made by skilled artisans using traditional techniques passed down through generations.',
      price: 850,
      category: 'Handicrafts',
      image: '/images/products/IMG20250322171134.jpg',
      images: [
        '/images/products/IMG20250322171134.jpg',
        '/images/products/IMG20250322171140.jpg',
        '/images/products/IMG20250322171214.jpg',
      ],
      artisan: 'Maya Tribal',
      tribe: 'Dhokra',
      region: 'Madhya Pradesh',
      stock: 12,
      rating: 4.7,
      popularity: 92,
      createdAt: '2025-1-15',
      featured: true,
    },
    {
      id: 2,
      name: 'Tribal Design Bottle',
      description: 'Exquisite handmade tribal Bottle crafted with traditional techniques. Each piece is unique and tells a story of tribal heritage.',
      price: 999,
      category: 'Handicrafts',
      image: '/images/products/IMG20250322171301.jpg',
      images: [
        '/images/products/IMG20250322171301.jpg',
        '/images/products/IMG20250322171319.jpg',
        '/images/products/IMG20250322171321.jpg',
        '/images/products/IMG20250322171334.jpg',
      ],
      artisan: 'Rajan Gond',
      tribe: 'Gond',
      region: 'Chhattisgarh',
      stock: 8,
      rating: 4.8,
      popularity: 88,
      createdAt: '2025-1-15',
      featured: true,
    },
    {
      id: 3,
      name: 'Handcrafted Dia Stand',
      description: 'Hand-crafted tribal bells made with traditional metalwork techniques by skilled artisans from indigenous tribes.',
      price: 499,
      category: 'Home Decor',
      image: '/images/products/IMG20250322171345.jpg',
      images: [
        '/images/products/IMG20250322171345.jpg',
        '/images/products/IMG20250322171347.jpg',
        '/images/products/IMG20250322171336.jpg',
      ],
      artisan: 'Kiran Bhil',
      tribe: 'Bhil',
      region: 'Rajasthan',
      stock: 15,
      rating: 4.6,
      popularity: 85,
      createdAt: '2025-02-12',
      featured: true,
    },
    {
      id: 4,
      name: 'Gullak',
      description: 'Traditional Piggy Bank Made by Mud created by master artisans using techniques that have been preserved for generations.',
      price: 399,
      category: 'Handicrafts',
      image: '/images/products/IMG20250322171413.jpg',
      images: [
        '/images/products/IMG20250322171413.jpg',
        '/images/products/IMG20250322171416.jpg',
        '/images/products/IMG20250322171425.jpg',
        '/images/products/IMG20250322171428.jpg',
      ],
      artisan: 'Vimal Warli',
      tribe: 'Warli',
      region: 'Maharashtra',
      stock: 10,
      rating: 4.9,
      popularity: 94,
      createdAt: '2023-10-05',
      featured: true,
    },
    {
      id: 5,
      name: 'Traditional Black Pot',
      description: 'Beautifully crafted metal figurine made using ancient techniques, representing the cultural heritage of indigenous tribes.',
      price: 200,
      category: 'Handicrafts',
      image: '/images/products/IMG20250322171435.jpg',
      images: [
        '/images/products/IMG20250322171510.jpg',
        '/images/products/IMG20250322171513.jpg',
      ],
      artisan: 'Suresh Koya',
      tribe: 'Koya',
      region: 'Odisha',
      stock: 7,
      rating: 4.7,
      popularity: 89,
      createdAt: '2023-10-12',
      featured: true,
    },
    {
      id: 6,
      name: 'Tribal Designer Pot',
      description: 'Pot handcrafted by tribal artisans, showcasing traditional patterns and designs.',
      price: 1200,
      category: 'Jewelry',
      image: '/images/products/IMG20250322170936.jpg',
      images: [
        '/images/products/IMG20250322170936.jpg',
        '/images/products/IMG20250322171011.jpg',
        '/images/products/IMG20250322171030.jpg',
        '/images/products/IMG20250322171036.jpg',
      ],
      artisan: 'Leela Dhokra',
      tribe: 'Dhokra',
      region: 'Jharkhand',
      stock: 18,
      rating: 4.5,
      popularity: 86,
      createdAt: '2023-09-30',
      featured: false,
    },
    {
      id: 7,
      name: 'Traditional Tribal Mask',
      description: 'Authentic tribal mask handcrafted using traditional materials and techniques, perfect for cultural displays and home decor.',
      price: 3600,
      category: 'Home Decor',
      image: '/images/products/IMG20250322171237.jpg',
      images: [
        '/images/products/IMG20250322171237.jpg',
        '/images/products/IMG20250322171252.jpg',
      ],
      artisan: 'Dilip Saora',
      tribe: 'Saora',
      region: 'Odisha',
      stock: 6,
      rating: 4.8,
      popularity: 91,
      createdAt: '2023-10-08',
      featured: false,
    },
    {
      id: 8,
      name: 'Tribal Ceremonial Art',
      description: 'Handcrafted ceremonial art piece showcasing the rich cultural traditions of indigenous tribes, perfect for collectors.',
      price: 4500,
      category: 'Art',
      image: '/images/products/IMG20250322171906.jpg',
      images: [
        '/images/products/IMG20250322171906.jpg',
        '/images/products/IMG20250322171908.jpg',
        '/images/products/IMG20250322171920.jpg',
        '/images/products/IMG20250322171924.jpg',
        '/images/products/IMG20250322171941.jpg',
        '/images/products/IMG20250322171945.jpg',
      ],
      artisan: 'Prita Kotpad',
      tribe: 'Kotpad',
      region: 'Chhattisgarh',
      stock: 4,
      rating: 4.9,
      popularity: 95,
      createdAt: '2023-10-14',
      featured: false,
    },


    {
      id: 9,
      name: 'Tribal Necklace',
      description: 'Beautifully handcrafted tribal necklace inspired by the Kotpad weaving tradition. Made using natural dyes and indigenous techniques, it reflects the cultural heritage of the Kotpad tribe.',
      price: 4500,
      category: 'Jewelry',
      image: '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.21 (1).jpeg',
      images: [
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.21 (1).jpeg',
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.21.jpeg',
      ],
      artisan: 'Prita Kotpad',
      tribe: 'Kotpad',
      region: 'Chhattisgarh',
      stock: 4,
      rating: 4.9,
      popularity: 95,
      createdAt: '2023-10-14',
      featured: true  // set to true if you want to highlight it on homepage
    }   ,
    {
      id: 10,
      name: 'Tribal Colorfull Necklace',
      description: 'Beautifully handcrafted tribal necklace inspired by the Kotpad weaving tradition. Made using natural dyes and indigenous techniques, it reflects the cultural heritage of the Kotpad tribe.',
      price: 5500,
      category: 'Jewelry',
      image: '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.22.jpeg',
      images: [
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.22.jpeg',
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.23 (1).jpeg',
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.23.jpeg'
      ],
      artisan: 'Prita Kotpad',
      tribe: 'Kotpad',
      region: 'Chhattisgarh',
      stock: 4,
      rating: 4.9,
      popularity: 95,
      createdAt: '2023-10-14',
      featured: true  // set to true if you want to highlight it on homepage
    }   ,
    {
      id: 11,
      name: 'Tribal Colorfull Necklace',
      description: 'Beautifully handcrafted tribal necklace inspired by the Kotpad weaving tradition. Made using natural dyes and indigenous techniques, it reflects the cultural heritage of the Kotpad tribe.',
      price: 5500,
      category: 'Jewelry',
      image: '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.22.jpeg',
      images: [
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.22.jpeg',
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.23 (1).jpeg',
        '/images/randoms/WhatsApp Image 2025-04-05 at 00.17.23.jpeg'
      ],
      artisan: 'Prita Kotpad',
      tribe: 'Kotpad',
      region: 'Chhattisgarh',
      stock: 4,
      rating: 4.9,
      popularity: 95,
      createdAt: '2023-10-14',
      featured: true  // set to true if you want to highlight it on homepage
    }     
  ]);
};

// This is a mock API service file with sample data for development
// In a real application, this would be replaced with actual API calls

// Mock Products Data
const products = [
  {
    id: 1,
    name: "Tribal Spirit Necklace",
    slug: "tribal-spirit-necklace",
    description: "Hand-crafted necklace made with natural beads and tribal patterns, representing spiritual connections to nature.",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: "/images/products/necklace.jpg",
    category: "Jewelry",
    tribe: "Maasai",
    rating: 4.8,
    isNew: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "Handwoven Tribal Basket",
    slug: "handwoven-tribal-basket",
    description: "Traditional basket woven from natural fibers using ancient techniques passed down through generations.",
    price: 59.99,
    originalPrice: 59.99,
    discount: 0,
    image: "/images/products/basket.jpg",
    category: "Baskets",
    tribe: "Navajo",
    rating: 4.5,
    isNew: false,
    isFeatured: true
  },
  {
    id: 3,
    name: "Ceremonial Tribal Mask",
    slug: "ceremonial-tribal-mask",
    description: "Authentic ceremonial mask carved by skilled artisans, representing ancestral spirits and cultural heritage.",
    price: 129.99,
    originalPrice: 159.99,
    discount: 18,
    image: "/images/products/mask.jpg",
    category: "Decor",
    tribe: "Yoruba",
    rating: 5.0,
    isNew: false,
    isFeatured: true
  },
  {
    id: 4,
    name: "Indigenous Pattern Textile",
    slug: "indigenous-pattern-textile",
    description: "Handwoven textile featuring traditional indigenous patterns and natural dyes from plant materials.",
    price: 89.99,
    originalPrice: 89.99,
    discount: 0,
    image: "/images/products/textile.jpg",
    category: "Textiles",
    tribe: "Maya",
    rating: 4.7,
    isNew: true,
    isFeatured: true
  },
  {
    id: 5,
    name: "Tribal Clay Pottery",
    slug: "tribal-clay-pottery",
    description: "Hand-formed and naturally fired clay pottery using traditional methods that date back centuries.",
    price: 69.99,
    originalPrice: 79.99,
    discount: 12,
    image: "/images/products/pottery.jpg",
    category: "Pottery",
    tribe: "Hopi",
    rating: 4.6,
    isNew: false,
    isFeatured: true
  },
  {
    id: 6,
    name: "Beaded Tribal Bracelet",
    slug: "beaded-tribal-bracelet",
    description: "Intricately beaded bracelet crafted using traditional techniques and patterns.",
    price: 49.99,
    originalPrice: 49.99,
    discount: 0,
    image: "/images/products/bracelet.jpg",
    category: "Jewelry",
    tribe: "Zulu",
    rating: 4.4,
    isNew: false,
    isFeatured: false
  }
];

// Mock Categories Data
const categories = [
  {
    id: 1,
    name: "Jewelry",
    slug: "jewelry",
    description: "Authentic tribal jewelry handcrafted with traditional techniques and materials",
    image: "/images/categories/jewelry.jpg",
    productCount: 12
  },
  {
    id: 2,
    name: "Textiles",
    slug: "textiles",
    description: "Hand-woven textiles featuring indigenous patterns and natural dyes",
    image: "/images/categories/textiles.jpg",
    productCount: 8
  },
  {
    id: 3,
    name: "Pottery",
    slug: "pottery",
    description: "Traditional clay pottery crafted using ancient firing techniques",
    image: "/images/categories/pottery.jpg",
    productCount: 6
  },
  {
    id: 4,
    name: "Baskets",
    slug: "baskets",
    description: "Intricately woven baskets using sustainable natural fibers",
    image: "/images/categories/baskets.jpg",
    productCount: 5
  },
  {
    id: 5,
    name: "Home Decor",
    slug: "decor",
    description: "Tribal-inspired decorative pieces to add cultural richness to any space",
    image: "/images/categories/decor.jpg",
    productCount: 10
  }
];

// API Functions
export const fetchFeaturedProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const featuredProducts = products.filter(product => product.isFeatured);
      resolve(featuredProducts);
    }, 500);
  });
};

export const fetchCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
};

export const fetchProductsByCategory = (categorySlug) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categoryProducts = products.filter(product => 
        product.category.toLowerCase() === categorySlug.toLowerCase() ||
        product.category.toLowerCase().replace(' ', '-') === categorySlug.toLowerCase()
      );
      resolve(categoryProducts);
    }, 500);
  });
};

export const fetchProductById = (productId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 500);
  });
};

export const fetchProductBySlug = (productSlug) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find(p => p.slug === productSlug);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 500);
  });
};

export const searchProducts = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.tribe.toLowerCase().includes(query.toLowerCase())
      );
      resolve(searchResults);
    }, 500);
  });
}; 