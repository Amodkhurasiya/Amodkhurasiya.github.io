import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage if available
const loadWishlistFromStorage = () => {
  try {
    const wishlistItems = localStorage.getItem('wishlistItems');
    return wishlistItems ? JSON.parse(wishlistItems) : [];
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return [];
  }
};

// Initial state
const initialState = {
  items: loadWishlistFromStorage(),
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const { id } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (!existingItem) {
        state.items.push(action.payload);
        
        // Save to localStorage
        localStorage.setItem('wishlistItems', JSON.stringify(state.items));
      }
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Save to localStorage
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      
      // Save to localStorage
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    }
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;