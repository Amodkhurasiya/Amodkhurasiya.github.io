import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaHandshake, FaQuestionCircle, FaHeadset } from 'react-icons/fa';
import styles from './Contact.module.css';
import { API_URL } from '../utils/env';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Message must be at least 20 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.contactPage}>
      {/* Contact Banner */}
      <div className={styles.contactBanner} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
        <div className="container">
          <div className={styles.bannerContent}>
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Reach out with any questions, feedback, or partnership inquiries.</p>
          </div>
        </div>
      </div>
      
      {/* Contact Content */}
      <div className={styles.contactContent}>
        <div className="container">
          <div className={styles.contactWrapper}>
            <div className={styles.contactInfo}>
              <h2>Get In Touch</h2>
              <p className={styles.contactIntro}>
                Have questions about our products, artisans, or shipping? Want to discuss a collaboration? 
                Our team is here to help!
              </p>
              
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <FaMapMarkerAlt />
                </div>
                <div className={styles.contactDetails}>
                  <h3>Visit Us</h3>
                  <p>123 Tribal Plaza (482003)<br />Jabalpur, Madhya Pradesh, India</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <FaPhone />
                </div>
                <div className={styles.contactDetails}>
                  <h3>Call Us</h3>
                  <p>+91 0123456789<br />+91 9876543210</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <FaEnvelope />
                </div>
                <div className={styles.contactDetails}>
                  <h3>Email Us</h3>
                  <p>info@trybee.com<br />support@trybee.com</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <div className={styles.contactIcon}>
                  <FaClock />
                </div>
                <div className={styles.contactDetails}>
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
              
              <div className={styles.socialLinks}>
                <h3>Follow Us</h3>
                <div className={styles.socialIcons}>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <FaTwitter />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <FaYoutube />
                  </a>
                </div>
              </div>
            </div>
            
            <div className={styles.contactForm}>
              <h2>Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className={styles.successMessage}>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you soon!</p>
                  <button 
                    className={styles.sendAgainBtn}
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {submitError && <div className={styles.formError}>{submitError}</div>}
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className={formErrors.name ? styles.inputError : ''}
                        disabled={isSubmitting}
                      />
                      {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Your Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className={formErrors.email ? styles.inputError : ''}
                        disabled={isSubmitting}
                      />
                      {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Enter message subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={formErrors.subject ? styles.inputError : ''}
                      disabled={isSubmitting}
                    />
                    {formErrors.subject && <p className={styles.errorText}>{formErrors.subject}</p>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Type your message here..."
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={formErrors.message ? styles.inputError : ''}
                      disabled={isSubmitting}
                    ></textarea>
                    {formErrors.message && <p className={styles.errorText}>{formErrors.message}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Information Section (Replacing Map) */}
      <div className={styles.infoSection}>
        <div className="container">
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FaHeadset />
              </div>
              <h3>Customer Support</h3>
              <p>Our dedicated customer support team is available to assist you with any questions or concerns about your orders, products, or account.</p>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FaHandshake />
              </div>
              <h3>Business Partnerships</h3>
              <p>Interested in wholesale opportunities or becoming a partner? We welcome collaboration inquiries from retailers and businesses.</p>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FaQuestionCircle />
              </div>
              <h3>Help Center</h3>
              <p>Visit our comprehensive Help Center for quick answers to common questions about shipping, returns, and payment options.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <div className="container">
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>How can I track my order?</h3>
              <p>
                Once your order is shipped, you will receive a tracking number via email. 
                You can use this number to track your order on our website under "Order Tracking".
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>What is your return policy?</h3>
              <p>
                We accept returns within 14 days of delivery. Items must be unused and in original packaging. 
                Please contact our support team to initiate a return.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>How do I know my payment is secure?</h3>
              <p>
                We use industry-standard encryption and secure payment gateways to process all transactions. 
                Your payment information is never stored on our servers.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I modify my order after it's placed?</h3>
              <p>
                Orders can be modified within 2 hours of placement. Please contact our customer service team immediately 
                if you need to make changes to your order.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Do you offer international shipping?</h3>
              <p>
                Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. 
                Shipping costs will be calculated at checkout.
              </p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>How can I become a retail partner?</h3>
              <p>
                We welcome retail partnership inquiries. Please email us at partnerships@trybee.com with details 
                about your business and we'll get back to you promptly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 