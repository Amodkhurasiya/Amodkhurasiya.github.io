import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ category }) => {
  return (
    <motion.div 
      className={styles.categoryCard}
      whileHover={{ 
        y: -8,
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
      }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/category/${category.slug}`} className={styles.categoryLink}>
        <div className={styles.imageContainer}>
          <img src={category.image} alt={category.name} className={styles.categoryImage} />
          <div className={styles.overlay}></div>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>{category.name}</h3>
          <p className={styles.description}>
            {category.description || `Explore our collection of ${category.name.toLowerCase()} crafted by tribal artisans`}
          </p>
          <span className={styles.viewLink}>
            Explore <FaArrowRight />
          </span>
        </div>
        
        {category.productCount && (
          <span className={styles.count}>{category.productCount} items</span>
        )}
        
        <div className={styles.tribalPattern}></div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard; 