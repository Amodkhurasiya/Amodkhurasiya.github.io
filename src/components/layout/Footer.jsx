import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone, FaCcVisa, FaCcMastercard, FaCcPaypal, FaGooglePay } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.tribal}></div>
      
      <div className={styles.footerContent}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={`${styles.column} ${styles.brandColumn}`}>
              <Link to="/" className={styles.footerLogo}>
                <div className={styles.logoText}>
                  <span className={styles.logoMain}>Trybee</span>
                  <span className={styles.logoTagline}>The Art of Tribe</span>
                </div>
              </Link>
              <p className={styles.description}>
                Discover authentic tribal crafts and artisanal treasures that celebrate indigenous heritage and craftsmanship, ethically sourced from native artisans worldwide.
              </p>
              <div className={styles.social}>
                <a href="#" className={styles.socialIcon}><FaFacebookF /></a>
                <a href="#" className={styles.socialIcon}><FaInstagram /></a>
                <a href="#" className={styles.socialIcon}><FaTwitter /></a>
                <a href="#" className={styles.socialIcon}><FaLinkedinIn /></a>
                <a href="#" className={styles.socialIcon}><FaYoutube /></a>
              </div>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Quick Links</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Shop</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/profile">My Account</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Categories</h4>
              <ul className={styles.footerLinks}>
                <li><Link to="/products?category=Jewelry">Jewelry</Link></li>
                <li><Link to="/products?category=Textiles">Textiles</Link></li>
                <li><Link to="/products?category=Handicrafts">Handicrafts</Link></li>
                <li><Link to="/products?category=Paintings">Paintings</Link></li>
                <li><Link to="/products?category=Forest%20Goods">Forest Goods</Link></li>
              </ul>
            </div>

            <div className={`${styles.column} ${styles.contactColumn}`}>
              <h4 className={styles.columnTitle}>Contact Us</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <FaMapMarkerAlt className={styles.contactIcon} />
                  <span>123 Tribal Plaza (482003), Jabalpur, Madhya Pradesh, India</span>
                </li>
                <li>
                  <FaPhone className={styles.contactIcon} />
                  <span>+91 0123456789</span>
                </li>
                <li>
                  <FaEnvelope className={styles.contactIcon} />
                  <span>support@trybee.com</span>
                </li>
              </ul>
              
              <div className={styles.paymentSection}>
                <h4 className={styles.paymentTitle}>Payment Methods</h4>
                <div className={styles.paymentIcons}>
                  <FaCcVisa className={styles.paymentIcon} title="Visa" />
                  <FaCcMastercard className={styles.paymentIcon} title="Mastercard" />
                  <FaCcPaypal className={styles.paymentIcon} title="PayPal" />
                  <FaGooglePay className={styles.paymentIcon} title="Google Pay" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <div className={styles.container}>
          <p>&copy; {currentYear} Trybee The Art of Tribe. All Rights Reserved.</p>
          <div className={styles.links}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/shipping">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 