import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShippingFast, FaLock, FaGem, FaUsers } from 'react-icons/fa';
import styles from './HomePage.module.css';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/category/CategoryCard';
import TestimonialSlider from '../components/elements/TestimonialSlider';
import { fetchFeaturedProducts, fetchCategories } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await fetchFeaturedProducts();
        const categoriesData = await fetchCategories();
        
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading homepage data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <motion.div 
            className={styles.heroText}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1>Discover Authentic <span className={styles.accent}>Tribal</span> Art & Crafts</h1>
            <p>Ethically sourced treasures from indigenous artisans bringing centuries of tradition and culture to your doorstep.</p>
            <motion.div className={styles.heroCta} variants={slideUp}>
              <Link to="/shop" className={styles.primaryBtn}>
                Explore Collection <FaArrowRight />
              </Link>
              <Link to="/about" className={styles.secondaryBtn}>
                Our Story
              </Link>
            </motion.div>
          </motion.div>
          <div className={styles.heroImageContainer}>
            <motion.div 
              className={styles.heroPattern}
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 0.8, rotate: 0 }}
              transition={{ duration: 1 }}
            ></motion.div>
            <motion.div 
              className={styles.heroImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
          </div>
        </div>
        <div className={styles.scrollIndicator}>
          <motion.div 
            className={styles.mouse}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          ></motion.div>
          <span>Scroll Down</span>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideUp}
          >
            <h2>Explore Categories</h2>
            <p>Browse our unique collection of handcrafted treasures from various tribal traditions</p>
          </motion.div>
          
          <motion.div 
            className={styles.categoriesGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <motion.div key={index} className={styles.categorySkeleton} variants={scaleIn} />
              ))
            ) : (
              categories.slice(0, 5).map(category => (
                <motion.div key={category.id} variants={scaleIn}>
                  <CategoryCard category={category} />
                </motion.div>
              ))
            )}
          </motion.div>
          
          <motion.div 
            className={styles.viewAllContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideUp}
          >
            <Link to="/categories" className={styles.viewAllBtn}>
              View All Categories <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideUp}
          >
            <h2>Featured Treasures</h2>
            <p>Our curated selection of exceptional handcrafted pieces from tribal artisans</p>
          </motion.div>
          
          <motion.div 
            className={styles.productsGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {loading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div key={index} className={styles.productSkeleton} variants={scaleIn} />
              ))
            ) : (
              featuredProducts.slice(0, 4).map(product => (
                <motion.div key={product.id} variants={scaleIn}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </motion.div>
          
          <motion.div 
            className={styles.viewAllContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideUp}
          >
            <Link to="/shop" className={styles.viewAllBtn}>
              View All Products <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Story/About Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <motion.div 
              className={styles.storyText}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={slideUp}
            >
              <h2>The <span className={styles.accent}>Tribal</span> Heritage</h2>
              <p>
                Trybee was born from a passion to preserve and celebrate indigenous craftsmanship. 
                We partner directly with tribal artisans, ensuring fair trade practices while bringing 
                authentic, handcrafted pieces to conscious consumers worldwide.
              </p>
              <p>
                Each item tells a story of cultural heritage, passed down through generations, 
                connecting you to rich traditions and supporting the artisans who keep these 
                ancestral crafts alive.
              </p>
              <Link to="/about" className={styles.textLink}>
                Learn more about our mission <FaArrowRight />
              </Link>
            </motion.div>
            <motion.div 
              className={styles.storyImage}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.storyImageOverlay}></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.featureCards}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div className={styles.featureCard} variants={scaleIn}>
              <div className={styles.featureIcon}>
                <FaShippingFast />
              </div>
              <h3>Free Shipping</h3>
              <p>On all orders over $75</p>
            </motion.div>
            
            <motion.div className={styles.featureCard} variants={scaleIn}>
              <div className={styles.featureIcon}>
                <FaLock />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </motion.div>
            
            <motion.div className={styles.featureCard} variants={scaleIn}>
              <div className={styles.featureIcon}>
                <FaGem />
              </div>
              <h3>Authentic Crafts</h3>
              <p>Certified tribal artworks</p>
            </motion.div>
            
            <motion.div className={styles.featureCard} variants={scaleIn}>
              <div className={styles.featureIcon}>
                <FaUsers />
              </div>
              <h3>Artisan Support</h3>
              <p>Fair trade practices</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideUp}
          >
            <h2>Customer Stories</h2>
            <p>What our community says about their tribal treasures</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <TestimonialSlider />
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaPattern}></div>
        <div className={styles.container}>
          <motion.div 
            className={styles.ctaContent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeIn}
          >
            <h2>Join Our Tribal Community</h2>
            <p>Subscribe to receive updates on new arrivals, special offers and artisan stories</p>
            <form className={styles.subscribeForm}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 