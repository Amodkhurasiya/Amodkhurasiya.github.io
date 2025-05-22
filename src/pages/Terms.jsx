import React from 'react';
import styles from './PolicyPages.module.css';

const Terms = () => {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyContent}>
          <h1 className={styles.pageTitle}>Terms & Conditions</h1>
          
          <div className={styles.lastUpdated}>
            Last Updated: June 10, 2023
          </div>
          
          <section className={styles.policySection}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Trybee The Art of Tribe. These Terms and Conditions govern your use of our website and the purchase of products from our online store. By accessing our website or placing an order, you agree to be bound by these Terms and Conditions.
            </p>
            <p>
              Please read these Terms and Conditions carefully before using our website or making a purchase. If you do not agree to all the terms and conditions, you must not use our website or services.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>2. General Terms</h2>
            <p>
              <strong>2.1 Acceptance:</strong> By accessing and using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
            <p>
              <strong>2.2 Modifications:</strong> We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after any changes constitutes your acceptance of the revised Terms and Conditions.
            </p>
            <p>
              <strong>2.3 Eligibility:</strong> You must be at least 18 years old or have the legal capacity to enter into a binding contract in your jurisdiction to use our website and make purchases.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>3. Products and Pricing</h2>
            <p>
              <strong>3.1 Product Descriptions:</strong> We strive to provide accurate product descriptions and imagery. However, we do not warrant that product descriptions, colors, or other content is accurate, complete, reliable, or error-free. Each handcrafted item is unique, and slight variations are inherent in artisanal products.
            </p>
            <p>
              <strong>3.2 Pricing:</strong> All prices are listed in Indian Rupees (INR) unless otherwise stated. Prices are subject to change without notice. We reserve the right to correct any pricing errors.
            </p>
            <p>
              <strong>3.3 Availability:</strong> Products are subject to availability. We reserve the right to discontinue any product at any time.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>4. Orders and Payment</h2>
            <p>
              <strong>4.1 Order Acceptance:</strong> Your order constitutes an offer to purchase products. All orders are subject to acceptance by us. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase.
            </p>
            <p>
              <strong>4.2 Payment:</strong> We accept various payment methods as indicated on our website. All payments must be received in full before orders are processed.
            </p>
            <p>
              <strong>4.3 Taxes:</strong> Applicable taxes will be added to your order total as required by law.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>5. Shipping and Delivery</h2>
            <p>
              <strong>5.1 Shipping Methods:</strong> We offer various shipping methods as described on our website. Shipping times are estimates and not guarantees.
            </p>
            <p>
              <strong>5.2 International Shipping:</strong> For international orders, you are responsible for all customs duties, taxes, and import charges that may apply in your country.
            </p>
            <p>
              <strong>5.3 Risk of Loss:</strong> The risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>6. Returns and Refunds</h2>
            <p>
              <strong>6.1 Return Policy:</strong> We accept returns within 30 days of delivery for most products. Items must be in original condition with all packaging and tags attached.
            </p>
            <p>
              <strong>6.2 Defective Items:</strong> If you receive a defective item, please contact us immediately for replacement or refund options.
            </p>
            <p>
              <strong>6.3 Refund Processing:</strong> Refunds will be issued to the original payment method and may take 5-10 business days to process after we receive the returned item.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>7. Intellectual Property</h2>
            <p>
              <strong>7.1 Copyright:</strong> All content on our website, including text, graphics, logos, images, and software, is the property of Trybee The Art of Tribe or its content suppliers and is protected by copyright laws.
            </p>
            <p>
              <strong>7.2 Trademarks:</strong> All trademarks, service marks, and trade names used on the site are trademarks or registered trademarks of Trybee The Art of Tribe or its affiliates.
            </p>
            <p>
              <strong>7.3 Use Restrictions:</strong> You may not reproduce, distribute, display, or create derivative works from any content on our website without our express written permission.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>8. User Accounts</h2>
            <p>
              <strong>8.1 Account Creation:</strong> You may need to create an account to use certain features of our website. You are responsible for maintaining the confidentiality of your account information.
            </p>
            <p>
              <strong>8.2 Account Termination:</strong> We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall Trybee The Art of Tribe, its directors, officers, employees, affiliates, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>10. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: legal@trybee.com</p>
              <p>Phone: +91 0123456789</p>
              <p>Address: 123 Tribal Plaza (482003), Jabalpur (MP), India.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms; 