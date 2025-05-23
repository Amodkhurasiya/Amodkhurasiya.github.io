import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { FaArrowLeft, FaImage } from 'react-icons/fa';
import styles from './AddProduct.module.css';
import { API_URL } from '../../utils/env';

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
    
    // Restore user from localStorage if not in Redux state
    if (!user && localStorage.getItem('user')) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
          dispatch(loginSuccess(storedUser));
        } else {
          navigate('/admin/login');
        }
      } catch (error) {
        navigate('/admin/login');
      }
    }
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create form data object for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      
      // Add image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      console.log('Submitting product with token:', token.substring(0, 10) + '...');
      
      // Send request to API
      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      // Log the response status
      console.log('Response status:', response.status);
      
      // Get response data for better error handling
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', responseData);
        throw new Error(responseData.message || responseData.error || 'Failed to add product');
      }
      
      console.log('Product added successfully:', responseData);
      
      setSuccess(true);
      resetForm();
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product');
      
      // Check for authentication errors
      if (error.message && (
        error.message.includes('Authentication') || 
        error.message.includes('token') || 
        error.message.includes('Access denied')
      )) {
        // Redirect to login
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => {
          navigate('/admin/login');
        }, 1000);
      }
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
    });
    setImageFiles([]);
    setPreviewUrls([]);
  };

  return (
    <div className={styles.addProduct}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/admin/products')}
        >
          <FaArrowLeft /> Back to Products
        </button>
        <h1>Add New Product</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Product added successfully! Redirecting...</div>}

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description"
              rows="5"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price in INR"
                min="0"
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Available quantity"
                min="0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
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
            <label>
              <span>Product Images</span>
              <small className={styles.imageHelper}>Upload up to 5 images</small>
            </label>
            <div className={styles.imageUpload}>
              <label htmlFor="images" className={styles.uploadLabel}>
                <FaImage /> Choose Images
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  disabled={loading}
                />
              </label>
              <span className={styles.selectedCount}>
                {imageFiles.length} {imageFiles.length === 1 ? 'image' : 'images'} selected
              </span>
            </div>
            
            {previewUrls.length > 0 && (
              <div className={styles.imagePreview}>
                {previewUrls.map((url, index) => (
                  <div key={index} className={styles.previewItem}>
                    <img src={url} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={resetForm}
              disabled={loading}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct; 