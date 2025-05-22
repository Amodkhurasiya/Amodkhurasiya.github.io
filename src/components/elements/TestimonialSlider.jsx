import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import styles from './TestimonialSlider.module.css';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "/images/avatar1.jpg",
    rating: 5,
    text: "I'm absolutely in love with my tribal necklace! The craftsmanship is exceptional, and I can feel the cultural significance in every detail. This is more than jewelry—it's a piece of living heritage that I'm honored to wear."
  },
  {
    id: 2,
    name: "Michael Thompson",
    location: "London, UK",
    avatar: "/images/avatar2.jpg",
    rating: 5,
    text: "The handwoven textile I purchased exceeded all my expectations. The intricate patterns and vibrant colors tell a story that connects me to traditions passed down through generations. It's now the centerpiece of my living room."
  },
  {
    id: 3,
    name: "Amara Okeke",
    location: "Lagos, Nigeria",
    avatar: "/images/avatar3.jpg",
    rating: 4,
    text: "As someone with a deep appreciation for indigenous art, I was searching for authentic pieces that respect the cultural origins. Trybee delivers exactly that—beautiful crafts with transparent sourcing and fair compensation for artisans."
  },
  {
    id: 4,
    name: "David Chen",
    location: "Toronto, Canada",
    avatar: "/images/avatar4.jpg",
    rating: 5,
    text: "The carved wooden sculpture I ordered has become a conversation starter in my home. Friends always ask about its origin and meaning, which gives me the opportunity to share the beautiful story behind it. Exceptional quality!"
  }
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);
  const length = testimonials.length;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setFade(true);
    
    setTimeout(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
      setFade(false);
    }, 300);
  };

  const prevSlide = () => {
    setFade(true);
    
    setTimeout(() => {
      setCurrent(current === 0 ? length - 1 : current - 1);
      setFade(false);
    }, 300);
  };

  const goToSlide = (index) => {
    if (index === current) return;
    setFade(true);
    
    setTimeout(() => {
      setCurrent(index);
      setFade(false);
    }, 300);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? styles.starFilled : styles.starEmpty} 
      />
    ));
  };

  return (
    <div className={styles.testimonialSlider}>
      <div className={styles.sliderContent}>
        <div className={`${styles.testimonial} ${fade ? styles.fadeOut : styles.fadeIn}`}>
          <div className={styles.quoteIcon}>
            <FaQuoteLeft />
          </div>
          <p className={styles.testimonialText}>{testimonials[current].text}</p>
          <div className={styles.rating}>
            {renderStars(testimonials[current].rating)}
          </div>
          <div className={styles.clientInfo}>
            <div className={styles.clientAvatar} style={{ backgroundImage: `url(${testimonials[current].avatar})` }}></div>
            <div className={styles.clientDetails}>
              <h4>{testimonials[current].name}</h4>
              <p>{testimonials[current].location}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.arrowBtn} onClick={prevSlide}>
          <FaArrowLeft />
        </button>
        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button 
              key={index}
              className={`${styles.dot} ${current === index ? styles.activeDot : ''}`} 
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
        <button className={styles.arrowBtn} onClick={nextSlide}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider; 