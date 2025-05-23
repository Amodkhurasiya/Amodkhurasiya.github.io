import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  filteredProducts: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: { min: 0, max: 10000 },
    searchQuery: '',
    sortBy: 'featured'
  }
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = applyFilters(action.payload, state.filters);
      state.loading = false;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    setPriceRangeFilter: (state, action) => {
      state.filters.priceRange = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.filteredProducts = applyFilters(state.products, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = state.products;
    }
  },
});

// Helper function to apply all filters
const applyFilters = (products, filters) => {
  // Ensure products is an array
  if (!products) return [];
  if (!Array.isArray(products)) {
    // Try to extract products array if it's an object with products property
    if (products.products && Array.isArray(products.products)) {
      products = products.products;
    } else {
      console.error('Products is not an array:', products);
      return [];
    }
  }
  
  if (!products.length) return [];
  
  let result = [...products];
  
  // Apply category filter
  if (filters.category) {
    result = result.filter(product => 
      product && product.category === filters.category
    );
  }
  
  // Apply price range filter
  result = result.filter(product => 
    product && 
    product.price >= filters.priceRange.min && 
    product.price <= filters.priceRange.max
  );
  
  // Apply search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(product => 
      product && (
        (product.name && product.name.toLowerCase().includes(query)) || 
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.artisan && product.artisan.toLowerCase().includes(query)) ||
        (product.tribe && product.tribe.toLowerCase().includes(query))
      )
    );
  }
  
  // Apply sorting
  switch (filters.sortBy) {
    case 'priceLowToHigh':
      result.sort((a, b) => (a?.price || 0) - (b?.price || 0));
      break;
    case 'priceHighToLow':
      result.sort((a, b) => (b?.price || 0) - (a?.price || 0));
      break;
    case 'newest':
      result.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
      break;
    case 'popularity':
      result.sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));
      break;
    // Default is 'featured', use the original order
  }
  
  return result;
};

export const { 
  fetchProductsStart, 
  fetchProductsSuccess, 
  fetchProductsFailure,
  fetchCategoriesSuccess,
  setCategoryFilter,
  setPriceRangeFilter,
  setSearchQuery,
  setSortBy,
  resetFilters
} = productsSlice.actions;

export default productsSlice.reducer; 