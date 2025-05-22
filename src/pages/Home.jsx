import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, fetchCategoriesSuccess } from '../redux/slices/productsSlice';
import { productAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import styles from './Home.module.css';

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, error } = useSelector(state => state.products);
  
  // State for artisan carousel
  const [currentArtisanSlide, setCurrentArtisanSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchProductsStart());
      try {
        // Fetch products
        const productsResponse = await productAPI.getAllProducts();
        dispatch(fetchProductsSuccess(productsResponse));
        
        // Fetch categories
        const categoriesResponse = await productAPI.getCategories();
        dispatch(fetchCategoriesSuccess(categoriesResponse.data));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message || 'Failed to fetch data'));
      }
    };
    
    fetchData();
  }, [dispatch]);
  
  // Set up artisan carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentArtisanSlide(prev => (prev === 0 ? 1 : 0));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  // Featured products (products marked as featured)
  const featuredProducts = products.filter(product => product.featured);
  
  // Artisan data
  const artisans = [
    {
      id: 1,
      name: "Meena Kumari",
      tribe: "Gond Tribe, Madhya Pradesh",
      story: "Meena has been practicing the traditional Gond art form for over 25 years, passing down the knowledge received from her grandmother. Her intricate patterns and vibrant colors tell stories of her community's mythology and daily life.",
      image: "https://plus.unsplash.com/premium_photo-1718570263772-b843cb76ed37?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJpYmFsJTIwcGVvcGxlJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 2,
      name: "Rajesh Patel",
      tribe: "Bhil Tribe, Gujarat",
      story: "Rajesh specializes in traditional Pithora paintings that have been part of his tribal heritage for generations. His work features colorful depictions of local deities, folklore and the relationship between humans and nature.",
      image: "https://images.unsplash.com/photo-1662748133106-e1b084a0db0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODN8fHRyaWJhbCUyMHBlb3BsZSUyMGluZGlhfGVufDB8fDB8fHww"
    }
  ];
  
  return (
    <div className={styles.home}>
      {/* Hero Banner */}
      <section className={styles.heroBanner} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1623723628621-ee7027bb182a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHRyaWJhbCUyMGhhbmRpY3JhZnQlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D)' }}>
        <div className={styles.bannerContent}>
          <h1>Discover the Artistry of Tribal India</h1>
          <p>Authentic handcrafted products directly from the skilled artisans of India's indigenous tribes</p>
          <div className={styles.bannerButtons}>
            <Link to="/products" className={`btn-primary ${styles.shopNowBtn}`}>Shop Now</Link>
            <Link to="/about" className={`btn-outline ${styles.learnMoreBtn}`}>Learn More</Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className={`section ${styles.featuredProducts}`}>
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          
          {loading ? (
            <div className={styles.loadingSpinner}>Loading...</div>
          ) : error ? (
            <div className={styles.errorMessage}>Error: {error}</div>
          ) : (
            <div className={styles.productsContainer}>
              {featuredProducts.map(product => (
                <div key={product.id} className={styles.productItem}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.viewAllWrapper}>
            <Link to="/products" className={styles.viewAllLink}>
              View All Products <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Shop by Category */}
      <section className={`section ${styles.categoriesSection}`}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className={`section ${styles.missionSection}`}>
        <div className="container">
          <div className={styles.missionContent}>
            <div className={styles.missionImage}>
              <img src="https://images.unsplash.com/photo-1716876995651-1ff85b65a6d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJpYmFsJTIwaGFuZGljcmFmdCUyMGluZGlhfGVufDB8fDB8fHww" alt="Tribal artisan working" />
            </div>
            <div className={styles.missionText}>
              <h2>Our Mission</h2>
              <p>At Trybee, we are dedicated to preserving and promoting the rich cultural heritage of India's tribal communities through their traditional art forms.</p>
              <p>We work directly with artisans from various tribes across India, ensuring fair wages, sustainable practices, and the continuation of age-old techniques.</p>
              <p>Every purchase you make helps support these indigenous communities and contributes to the preservation of their unique cultural identity.</p>
              <Link to="/about" className={styles.readMoreLink}>
                Read More About Our Mission <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Artisan Spotlight */}
      <section className={`section ${styles.artisanSpotlight}`}>
        <div className="container">
          <h2 className="section-title">Artisan Spotlight</h2>
          
          <div 
            className={styles.artisanCarousel}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {artisans.map((artisan, index) => (
              <div 
                key={artisan.id} 
                className={`${styles.artisanCard} ${index === currentArtisanSlide ? styles.activeSlide : styles.inactiveSlide}`}
              >
                <div className={styles.artisanImage}>
                  <img src={artisan.image} alt={`${artisan.name} - Artisan`} />
                </div>
                <div className={styles.artisanInfo}>
                  <h3>{artisan.name}</h3>
                  <p className={styles.artisanTribe}>{artisan.tribe}</p>
                  <p className={styles.artisanStory}>
                    {artisan.story}
                  </p>
                </div>
              </div>
            ))}
            
            <div className={styles.carouselIndicators}>
              <button 
                className={`${styles.indicator} ${currentArtisanSlide === 0 ? styles.activeIndicator : ''}`}
                onClick={() => setCurrentArtisanSlide(0)}
                aria-label="View first artisan"
              ></button>
              <button 
                className={`${styles.indicator} ${currentArtisanSlide === 1 ? styles.activeIndicator : ''}`}
                onClick={() => setCurrentArtisanSlide(1)}
                aria-label="View second artisan"
              ></button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className={`section ${styles.testimonials}`}>
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                "The handwoven textile I purchased is absolutely beautiful. The quality and craftsmanship are exceptional, and knowing the story behind it makes it even more special."
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Sarah Johnson" />
                <div>
                  <h4>Sarah Johnson</h4>
                  <p>New York, USA</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                "I've been collecting tribal art for years, and Trybe offers some of the most authentic pieces I've seen. Their direct connection with the artisans makes all the difference."
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Rajiv Mehta" />
                <div>
                  <h4>Rajiv Mehta</h4>
                  <p>Mumbai, India</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialText}>
                "The jewelry I ordered arrived beautifully packaged with information about the artisan who created it. It's more than just a purchase; it's supporting a cultural legacy."
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Emma Thompson" />
                <div>
                  <h4>Emma Thompson</h4>
                  <p>London, UK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Support Our Mission Section (Replacing Join Our Artisan Community) */}
      <section className={styles.subscribeSection}>
        <div className="container">
          <div className={styles.subscribeContent}>
            <h2>Support Our Mission</h2>
            <p>Every purchase helps tribal artisans preserve their cultural heritage and improve their livelihoods.</p>
            <div className={styles.missionStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>200+</span>
                <span className={styles.statLabel}>Artisans Supported</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>15</span>
                <span className={styles.statLabel}>Tribal Communities</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 