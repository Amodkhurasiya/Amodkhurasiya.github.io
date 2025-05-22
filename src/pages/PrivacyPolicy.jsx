import React from 'react';
import styles from './PolicyPages.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyContent}>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          
          <div className={styles.lastUpdated}>
            Last Updated: June 10, 2023
          </div>
          
          <section className={styles.policySection}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Trybee The Art of Tribe ("Trybee," "we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>2. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, participate in activities on the website, or otherwise contact us. The personal information that we collect depends on the context of your interactions with us and may include:
            </p>
            <ul>
              <li>Name and contact information (email address, phone number, etc.)</li>
              <li>Billing and shipping address</li>
              <li>Payment information (stored securely through our payment processors)</li>
              <li>Account preferences and profile information</li>
              <li>Purchase history</li>
            </ul>
            
            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, we may collect information about the individual web pages that you view, what websites or search terms referred you to our website, and information about how you interact with the website.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Provide, maintain, and improve our services</li>
              <li>Communicate with you about products, services, promotions, and events</li>
              <li>Create and manage your account</li>
              <li>Process payments and prevent fraud</li>
              <li>Respond to customer service requests</li>
              <li>Send administrative information, such as updates to our terms and policies</li>
              <li>Understand user preferences to enhance the user experience</li>
            </ul>
          </section>
          
          <section className={styles.policySection}>
            <h2>4. Sharing Your Information</h2>
            <p>
              We may share your information with third parties in the following situations:
            </p>
            <ul>
              <li>With service providers who perform services for us</li>
              <li>With artisans and partners to fulfill your orders</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information with third parties for their commercial purposes.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>5. Your Rights and Choices</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>6. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>7. Children's Privacy</h2>
            <p>
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
            </p>
          </section>
          
          <section className={styles.policySection}>
            <h2>9. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our practices, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: privacy@trybee.com</p>
              <p>Phone: +91 0123456789</p>
              <p>Address: 123 Tribal Plaza (482003), Jabalpur (MP), India.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 