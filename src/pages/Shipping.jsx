import React from 'react';
import styles from './PolicyPages.module.css';

const Shipping = () => {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyContent}>
          <h1 className={styles.pageTitle}>Shipping Information</h1>
          
          <div className={styles.lastUpdated}>
            Last Updated: June 10, 2023
          </div>
          
          <section className={styles.policySection}>
            <h2>Domestic Shipping</h2>
            <p>
              We are committed to delivering your handcrafted tribal products safely and quickly to your doorstep. Here's everything you need to know about our shipping policies and procedures.
            </p>
            
            <h3>Shipping Methods & Timeframes</h3>
            <div className={styles.shippingTable}>
              <div className={styles.tableRow}>
                <div className={styles.tableHeader}>Shipping Method</div>
                <div className={styles.tableHeader}>Estimated Delivery</div>
                <div className={styles.tableHeader}>Cost</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>Standard Shipping</div>
                <div>5-7 business days</div>
                <div>₹150 (Free on orders over ₹2,000)</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>Express Shipping</div>
                <div>2-3 business days</div>
                <div>₹350</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>Same-Day Delivery</div>
                <div>Same day (order before 12 PM, select cities only)</div>
                <div>₹500</div>
              </div>
            </div>
            
            <p>
              <strong>Processing Time:</strong> All orders are processed within 24-48 hours of being placed. During peak seasons or sale events, processing may take an additional 1-2 business days.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>International Shipping</h2>
            <p>
              We ship to over 50 countries worldwide, bringing authentic tribal crafts to customers around the globe.
            </p>
            
            <h3>International Shipping Methods & Timeframes</h3>
            <div className={styles.shippingTable}>
              <div className={styles.tableRow}>
                <div className={styles.tableHeader}>Region</div>
                <div className={styles.tableHeader}>Estimated Delivery</div>
                <div className={styles.tableHeader}>Cost</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>North America</div>
                <div>7-14 business days</div>
                <div>₹1,500 (Free on orders over ₹10,000)</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>Europe</div>
                <div>7-14 business days</div>
                <div>₹1,800 (Free on orders over ₹12,000)</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>Asia Pacific</div>
                <div>5-10 business days</div>
                <div>₹1,200 (Free on orders over ₹8,000)</div>
              </div>
              
              <div className={styles.tableRow}>
                <div>Rest of World</div>
                <div>14-21 business days</div>
                <div>₹2,000 (Free on orders over ₹15,000)</div>
              </div>
            </div>
            
            <h3>Customs, Duties & Taxes</h3>
            <p>
              International customers are responsible for all customs duties, taxes, and import charges that may apply in your country. These fees are not included in the shipping cost or product price and will be collected by the delivery carrier or customs office.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>Order Tracking</h2>
            <p>
              All orders will receive a tracking number via email once your package has been shipped. You can track your order's status at any time by:
            </p>
            <ul>
              <li>Logging into your account and viewing your order history</li>
              <li>Using the tracking link in your shipping confirmation email</li>
              <li>Contacting our customer service team with your order number</li>
            </ul>
          </section>
          
          <section className={styles.policySection}>
            <h2>Shipping Restrictions</h2>
            <p>
              Due to the nature of some of our products, we cannot ship certain items to specific locations due to import restrictions or other regulations. These restrictions will be noted on the product page when applicable.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>Delivery Issues</h2>
            <h3>Lost or Damaged Packages</h3>
            <p>
              If your package is damaged upon arrival or appears to be lost in transit, please contact our customer service team within 7 days of the expected delivery date. We will work with the shipping carrier to resolve the issue and ensure you receive your order or are appropriately compensated.
            </p>
            
            <h3>Address Changes</h3>
            <p>
              If you need to change your shipping address after placing an order, please contact us immediately. We can only accommodate address changes if the order has not yet been shipped.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>Eco-Friendly Packaging</h2>
            <p>
              At Trybee, we're committed to sustainability. All our products are packaged using eco-friendly materials that are either recyclable or biodegradable. Our packaging includes:
            </p>
            <ul>
              <li>Recycled cardboard boxes</li>
              <li>Paper-based cushioning materials</li>
              <li>Biodegradable bubble wrap alternatives</li>
              <li>Recycled paper for printed materials</li>
            </ul>
          </section>
          
          <section className={styles.policySection}>
            <h2>Contact Our Shipping Department</h2>
            <p>
              If you have any questions about shipping or need assistance with your order, please contact our shipping department:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: shipping@trybee.com</p>
              <p>Phone: +91 0123456789</p>
              <p>Hours: Monday-Friday, 9:00 AM - 6:00 PM IST</p>
              <p>Address: 123 Tribal Plaza (482003), Jabalpur (MP), India.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shipping; 