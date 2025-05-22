import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';

// Map of category names to image URLs
const categoryImages = {
  'Handicrafts': 'https://images.unsplash.com/photo-1718711621203-74a4b19839e7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhhbmRpY3JhZnR8ZW58MHx8MHx8fDA%3D',
  'Textiles': 'https://images.unsplash.com/photo-1693648800012-462fc2399863?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fHRleHR0aWxlJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
  'Jewelry': 'https://images.unsplash.com/photo-1646882172870-303c3be7b1d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAyfHx0cmliYWwlMjBqZXdsZXJ5JTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
  'Paintings': 'https://plus.unsplash.com/premium_photo-1702088082212-52ecb79bab73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHRyaWJhbCUyMHBhaW50aW5nJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
  'Forest Goods': 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGhvbmV5JTIwaW1hZ2VzfGVufDB8fDB8fHww',
};

const CategoryCard = ({ category }) => {
  if (!category) return null;
  
  // Get the image URL for this category, or use a default image
  const imageUrl = categoryImages[category] || 'https://images.unsplash.com/photo-1605725110929-dd318a0571d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
  
  return (
    <div className={styles.categoryCard}>
      <Link to={`/products?category=${encodeURIComponent(category)}`} className={styles.categoryLink}>
        <img src={imageUrl} alt={category} className={styles.categoryImage} />
        <div className={styles.categoryOverlay}>
          <h3 className={styles.categoryName}>{category}</h3>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard; 