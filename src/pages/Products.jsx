import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProductsStart, 
  fetchProductsSuccess, 
  fetchProductsFailure,
  fetchCategoriesSuccess,
  setCategoryFilter,
  setPriceRangeFilter,
  setSearchQuery,
  setSortBy,
  resetFilters
} from '../redux/slices/productsSlice';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import styles from './Products.module.css';

const Products = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { products, filteredProducts, categories, loading, error, filters } = useSelector(state => state.products);
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 10000 },
    searchQuery: '',
    sortBy: 'featured'
  });
  
  // Get query parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    // Update filters based on URL parameters
    if (categoryParam) {
      dispatch(setCategoryFilter(categoryParam));
      setLocalFilters(prev => ({ ...prev, category: categoryParam }));
    }
    
    if (searchParam) {
      dispatch(setSearchQuery(searchParam));
      setLocalFilters(prev => ({ ...prev, searchQuery: searchParam }));
    }
  }, [location.search, dispatch]);
  
  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchProductsStart());
      try {
        // Fetch products
        const productsResponse = await productAPI.getAllProducts();
        // Ensure productsResponse is an array
        const productsArray = Array.isArray(productsResponse) ? productsResponse : 
                             (productsResponse && Array.isArray(productsResponse.products)) ? 
                             productsResponse.products : [];
        dispatch(fetchProductsSuccess(productsArray));
        
        // Fetch categories
        const categoriesResponse = await productAPI.getCategories();
        const categoriesArray = Array.isArray(categoriesResponse.data) ? 
                               categoriesResponse.data : [];
        dispatch(fetchCategoriesSuccess(categoriesArray));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message));
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  // Update local filter state and auto-apply
  const handleFilterChange = (filterType, value) => {
    const updatedFilters = {
      ...localFilters,
      [filterType]: value
    };
    setLocalFilters(updatedFilters);
    
    // Auto-apply the filter
    if (filterType === 'category') {
      dispatch(setCategoryFilter(value));
    } else if (filterType === 'sortBy') {
      dispatch(setSortBy(value));
    }
  };
  
  // Handle price range change
  const handlePriceRangeChange = (type, value) => {
    const updatedPriceRange = {
      ...localFilters.priceRange,
      [type]: parseInt(value)
    };
    
    setLocalFilters(prev => ({
      ...prev,
      priceRange: updatedPriceRange
    }));
  };
  
  // Apply price range filter when user is done changing values
  const handlePriceRangeApply = () => {
    dispatch(setPriceRangeFilter(localFilters.priceRange));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setLocalFilters({
      category: '',
      priceRange: { min: 0, max: 10000 },
      searchQuery: '',
      sortBy: 'featured'
    });
    dispatch(resetFilters());
  };
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleResetFilters();
  };
  
  return (
    <div className={styles.productsPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Explore Tribal Products</h1>
        
        <div className={styles.topControls}>
          <div className={styles.searchBar}>
            <form onSubmit={handleSearchSubmit}>
              <div className={styles.searchInputContainer}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={localFilters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <FaSearch />
                </button>
              </div>
            </form>
            <button 
              className={styles.mobileFilterBtn}
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <FaFilter /> Filters
            </button>
          </div>
          
          {/* Horizontal Filter Section */}
          <div className={styles.horizontalFilterSection}>
            <div className={styles.filterPill}>
              <select
                id="categorySelect"
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterPill}>
              <div className={styles.priceRangeControls}>
                <span>Price:</span>
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max={localFilters.priceRange.max}
                  value={localFilters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  onBlur={handlePriceRangeApply}
                  className={styles.priceInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  min={localFilters.priceRange.min}
                  value={localFilters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  onBlur={handlePriceRangeApply}
                  className={styles.priceInput}
                />
              </div>
            </div>
            
            <div className={styles.filterPill}>
              <select
                id="sortSelect"
                value={localFilters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="featured">Sort: Featured</option>
                <option value="priceLowToHigh">Sort: Price Low-High</option>
                <option value="priceHighToLow">Sort: Price High-Low</option>
                <option value="newest">Sort: Newest</option>
                <option value="popularity">Sort: Popularity</option>
              </select>
            </div>
            
            <button 
              className={styles.resetFilterBtn}
              onClick={handleResetFilters}
            >
              <FaTimes /> Reset
            </button>
          </div>
        </div>
        
        <div className={styles.productContent}>
          {/* Mobile Filter Panel */}
          <aside className={`${styles.filterSidebar} ${isMobileFilterOpen ? styles.open : ''}`}>
            <div className={styles.filterHeader}>
              <h2>Filters</h2>
              <button 
                className={styles.closeFilterBtn}
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.filterSection}>
              <h3>Categories</h3>
              <div className={styles.filterOptions}>
                <div className={styles.filterOption}>
                  <input
                    type="radio"
                    id="category-all"
                    name="category"
                    value=""
                    checked={localFilters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                  />
                  <label htmlFor="category-all">All Categories</label>
                </div>
                
                {categories.map((category, index) => (
                  <div key={index} className={styles.filterOption}>
                    <input
                      type="radio"
                      id={`category-${index}`}
                      name="category"
                      value={category}
                      checked={localFilters.category === category}
                      onChange={() => handleFilterChange('category', category)}
                    />
                    <label htmlFor={`category-${index}`}>{category}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.filterSection}>
              <h3>Price Range</h3>
              <div className={styles.priceInputs}>
                <div className={styles.priceInput}>
                  <label htmlFor="min-price">Min</label>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    max={localFilters.priceRange.max}
                    value={localFilters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    onBlur={handlePriceRangeApply}
                  />
                </div>
                <div className={styles.priceInput}>
                  <label htmlFor="max-price">Max</label>
                  <input
                    type="number"
                    id="max-price"
                    min={localFilters.priceRange.min}
                    value={localFilters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    onBlur={handlePriceRangeApply}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.filterActions}>
              <button 
                className={styles.resetBtn}
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </aside>
          
          {/* Products Grid */}
          <div className={styles.productsGrid}>
            {loading ? (
              <div className={styles.loading}>Loading products...</div>
            ) : error ? (
              <div className={styles.error}>Error: {error}</div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <p className={styles.resultsCount}>
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
                
                <div className={styles.productsContainer}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noResults}>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button 
                  className={styles.resetBtn}
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile filters */}
      {isMobileFilterOpen && (
        <div 
          className={styles.filterOverlay}
          onClick={() => setIsMobileFilterOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Products; 