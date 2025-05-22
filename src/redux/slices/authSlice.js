import { createSlice } from '@reduxjs/toolkit'

// Check if user exists in localStorage
const user = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;

// Check if token exists in localStorage
const token = localStorage.getItem('token') || null;

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!(user && token),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Save to localStorage with improved error handling
      try {
        if (token) {
          localStorage.setItem('token', token);
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        // Log authentication success
        console.log('Authentication successful:', {
          userId: user?._id,
          role: user?.role,
          tokenReceived: !!token
        });
      } catch (error) {
        console.error('Error saving auth data to localStorage:', error);
      }
    },
    tokenReceived: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Save to localStorage
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    // Add a restore auth action
    restoreAuth: (state) => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUserStr = localStorage.getItem('user');
        
        if (!storedToken || !storedUserStr) {
          return;
        }
        
        const storedUser = JSON.parse(storedUserStr);
        
        if (storedToken && storedUser) {
          console.log('Restoring authentication from localStorage:', {
            userId: storedUser?._id,
            role: storedUser?.role
          });
          
          state.token = storedToken;
          state.user = storedUser;
          state.isAuthenticated = true;
        }
      } catch (error) {
        console.error('Error restoring authentication:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  tokenReceived,
  logout, 
  registerStart, 
  registerSuccess, 
  registerFailure,
  updateProfile,
  restoreAuth
} = authSlice.actions;

export default authSlice.reducer; 