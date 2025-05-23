import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaImage, FaFilter, FaSearch, FaTimes, FaEye, FaArrowLeft, FaSort } from 'react-icons/fa';
import styles from './ProductManagement.module.css';
import { API_URL } from '../../utils/env';

const ProductManagement = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    inStock: 'all',
    priceRange: { min: '', max: '' },
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  const categories = [
    'All Categories',
    'Handicrafts',
    'Textiles',
    'Jewelry',
    'Paintings',
    'Forest Goods'
  ];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  // Apply filters whenever products or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [products, filters, sortConfig]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/products`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];
    
    // Apply category filter
    if (filters.category && filters.category !== 'All Categories') {
      result = result.filter(product => product.category === filters.category);
    }
    
    // Apply stock filter
    if (filters.inStock === 'inStock') {
      result = result.filter(product => product.stock > 0);
    } else if (filters.inStock === 'outOfStock') {
      result = result.filter(product => product.stock === 0);
    } else if (filters.inStock === 'lowStock') {
      result = result.filter(product => product.stock > 0 && product.stock <= 5);
    }
    
    // Apply price range filter
    if (filters.priceRange.min) {
      result = result.filter(product => product.price >= parseInt(filters.priceRange.min));
    }
    
    if (filters.priceRange.max) {
      result = result.filter(product => product.price <= parseInt(filters.priceRange.max));
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        (product.tribe && product.tribe.toLowerCase().includes(searchTerm)) ||
        (product.artisan && product.artisan.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle date fields specially
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
          const dateA = new Date(a[sortConfig.key] || 0);
          const dateB = new Date(b[sortConfig.key] || 0);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        // Handle numeric fields
        if (sortConfig.key === 'price' || sortConfig.key === 'stock') {
          const valA = parseFloat(a[sortConfig.key]) || 0;
          const valB = parseFloat(b[sortConfig.key]) || 0;
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        
        // Default string comparison
        const valueA = a[sortConfig.key] || '';
        const valueB = b[sortConfig.key] || '';
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortConfig.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        return 0;
      });
    }
    
    setFilteredProducts(result);
  };

  const getProductCount = () => {
    return {
      total: products.length,
      outOfStock: products.filter(p => p.stock === 0).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length
    };
  };

  const productCounts = getProductCount();

  const handleFilterChange = (filterName, value) => {
    if (filterName === 'priceRange') {
      setFilters(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [value.field]: value.value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterName]: value
      }));
    }
  };

  const handleSort = (key) => {
    // If clicking the same key, toggle direction
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      inStock: 'all',
      priceRange: { min: '', max: '' },
      search: ''
    });
  };

  const getProcessedImageUrl = (imgUrl) => {
    if (!imgUrl) return '/images/placeholder.png';
    
    try {
      // Get API base URL without /api path
      const apiBaseUrl = API_URL.replace('/api', '');
      
      // Check if URL is already absolute
      if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        return imgUrl;
      }
      
      // Check if URL starts with //
      if (imgUrl.startsWith('//')) {
        return `https:${imgUrl}`;
      }
      
      // Handle path with duplicate '/uploads/uploads/'
      if (imgUrl.startsWith('/uploads/uploads/')) {
        return `${apiBaseUrl}${imgUrl.replace('/uploads/uploads/', '/uploads/')}`;
      }
      
      // Default handling: append to API base URL
      return imgUrl.startsWith('/') 
        ? `${apiBaseUrl}${imgUrl}`
        : `${apiBaseUrl}/${imgUrl}`;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return '/images/placeholder.png';
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.map(file => file.name)]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (imageFiles.length === 0) {
        setError('At least one image is required');
        return;
      }
      
      // Add image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      // Close modal and reset form
      setShowAddModal(false);
      resetForm();
      // Refresh product list
      await fetchProducts();
      
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product');
      
      // If token is invalid, redirect to login
      if (error.message.includes('authentication') || error.message.includes('token')) {
        navigate('/admin/login');
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add new image files if any were selected
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      const response = await fetch(`${API_URL}/admin/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      // Close modal and reset form
      setShowEditModal(false);
      resetForm();
      // Refresh product list
      await fetchProducts();
      
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product');
      
      // If token is invalid, redirect to login
      if (error.message.includes('authentication') || error.message.includes('token')) {
        navigate('/admin/login');
      }
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      console.log('Deleting product:', productId);
      
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { message: responseText || 'Unknown error' };
      }

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to delete product. Status: ${response.status}`);
      }
      
      // Remove the deleted product from the state
      setProducts(products.filter(product => product._id !== productId));
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message || 'Failed to delete product');
      alert('Failed to delete product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: []
    });
    setImageFiles([]);
    setPreviewUrls([]);
    setSelectedProduct(null);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      images: product.images || []
    });
    setShowEditModal(true);
  };

  const getStockStatusClass = (stock) => {
    if (stock === 0) {
      return styles.statusOutOfStock;
    } else if (stock <= 5) {
      return styles.statusLowStock;
    } else {
      return styles.statusInStock;
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className={styles.productManagement}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.productManagement}>
        <div className={styles.error}>
          {error}
          <button onClick={fetchProducts} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productManagement}>
      <header className={styles.header}>
        <div>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/admin')}
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>Product Management</h1>
          <div className={styles.statsOverview}>
            <div>Total Products: <span>{productCounts.total}</span></div>
            <div>Out of Stock: <span>{productCounts.outOfStock}</span></div>
            <div>Low Stock: <span>{productCounts.lowStock}</span></div>
          </div>
        </div>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add New Product
        </button>
      </header>

      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Category:</label>
          <select 
            className={styles.filterSelect}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              category !== 'All Categories' && (
                <option key={index} value={category}>{category}</option>
              )
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Stock Status:</label>
          <select 
            className={styles.filterSelect}
            value={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Price Range:</label>
          <div className={styles.priceRangeInputs}>
            <input 
              type="number" 
              placeholder="Min" 
              value={filters.priceRange.min}
              onChange={(e) => handleFilterChange('priceRange', { field: 'min', value: e.target.value })}
              className={styles.priceInput}
              min="0"
            />
            <span className={styles.rangeSeparator}>to</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={filters.priceRange.max}
              onChange={(e) => handleFilterChange('priceRange', { field: 'max', value: e.target.value })}
              className={styles.priceInput}
              min="0"
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>Search:</label>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <button className={styles.resetButton} onClick={resetFilters}>
          Clear Filters
        </button>
      </div>

      <div className={styles.resultSummary}>
        <span>Showing {filteredProducts.length} of {products.length} products</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('name')}>
                  Name <FaSort />
                </button>
              </th>
              <th>Category</th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('price')}>
                  Price <FaSort />
                </button>
              </th>
              <th>
                <button className={styles.sortButton} onClick={() => handleSort('stock')}>
                  Stock <FaSort />
                </button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getProcessedImageUrl(product.images[0])} 
                        alt={product.name}
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.noImage}>
                        <FaImage />
                      </div>
                    )}
                  </td>
                  <td className={styles.productName}>{product.name}</td>
                  <td>{product.category || 'Uncategorized'}</td>
                  <td className={styles.productPrice}>{formatPrice(product.price)}</td>
                  <td>
                    <span className={`${styles.status} ${getStockStatusClass(product.stock)}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => navigate(`/admin/products/${product._id}`)}
                        title="View Product Details"
                      >
                        <FaEye /> <span>View</span>
                      </button>
                      <button 
                        className={styles.editButton}
                        onClick={() => openEditModal(product)}
                        title="Edit Product"
                      >
                        <FaEdit /> <span>Edit</span>
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(product._id)}
                        title="Delete Product"
                      >
                        <FaTrash /> <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noProducts}>
                  No products found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Add New Product</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className={styles.formControl}
                >
                  <option value="">Select Category</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Paintings">Paintings</option>
                  <option value="Forest Goods">Forest Goods</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className={styles.formControl}
                />
                <div className={styles.imagePreview}>
                  {previewUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>Add Product</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className={styles.formControl}
                >
                  <option value="">Select Category</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Paintings">Paintings</option>
                  <option value="Forest Goods">Forest Goods</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
                  className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.formControl}
                />
                <div className={styles.imagePreview}>
                  {formData.images && formData.images.map((img, index) => (
                    <img key={index} src={getProcessedImageUrl(img)} alt={`Product ${index + 1}`} />
                  ))}
                  {previewUrls.map((url, index) => (
                    <img key={`new-${index}`} src={url} alt={`New Preview ${index + 1}`} />
                  ))}
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>Update Product</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 