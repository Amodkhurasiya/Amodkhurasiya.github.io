import { Link } from 'react-router-dom';
import { FaLeaf, FaHandshake, FaGlobeAsia, FaUsers } from 'react-icons/fa';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Banner */}
      <div className={styles.heroBanner} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605725960311-095003bd2a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)' }}>
        <div className="container">
          <div className={styles.bannerContent}>
            <h1>Our Story</h1>
            <p>Connecting tribal artisans with global audiences and preserving cultural heritage</p>
          </div>
        </div>
      </div>
      
      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className="container">
          <div className={styles.sectionContent}>
            <div className={styles.textContent}>
              <h2>Our Mission</h2>
              <p>
                At Trybee: The Art of Tribe, our mission is to bridge the gap between traditional tribal artisans and the global market. 
                We are dedicated to promoting and preserving the rich cultural heritage of India's indigenous tribes through their 
                exceptional craftsmanship and artistry.
              </p>
              <p>
                We believe that by providing these skilled artisans with a platform to showcase and sell their creations, we can 
                help sustain their livelihoods while introducing the world to the beauty and significance of tribal art forms 
                that have been passed down through generations.
              </p>
            </div>
            <div className={styles.imageContent}>
              <img src="https://images.unsplash.com/photo-1739997698960-60b2a5c243ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1pc3Npb24lMjB0cmliYWx8ZW58MHx8MHx8fDA%3D" alt="Traditional tribal art" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Values</h2>
          
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FaHandshake />
              </div>
              <h3>Fair Trade</h3>
              <p>
                We ensure that artisans receive fair compensation for their work, empowering them economically and 
                fostering sustainable livelihoods.
              </p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FaGlobeAsia />
              </div>
              <h3>Cultural Preservation</h3>
              <p>
                We are committed to preserving and promoting the diverse cultural heritage of India's tribal communities 
                by supporting their traditional art forms.
              </p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FaLeaf />
              </div>
              <h3>Sustainability</h3>
              <p>
                We prioritize environmentally conscious practices and support artisans who use sustainable, locally-sourced 
                materials and traditional techniques.
              </p>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <FaUsers />
              </div>
              <h3>Community Development</h3>
              <p>
                We invest in the communities of our artisan partners through education, healthcare, and infrastructure 
                initiatives to create lasting positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Journey Section */}
      <section className={styles.journeySection}>
        <div className="container">
          <div className={styles.sectionContent}>
            <div className={styles.imageContent}>
              <img src="https://images.unsplash.com/photo-1605627079912-97c3810a11a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Founder with tribal artisans" />
            </div>
            <div className={styles.textContent}>
              <h2>Our Journey</h2>
              <p>
                Trybe began in 2018 when our founder, Aanya Sharma, traveled across rural India and witnessed the incredible craftsmanship 
                of tribal artisans. She also saw the challenges they faced in reaching markets beyond their local communities.
              </p>
              <p>
                Inspired by their skills and stories, Aanya established Trybe as a bridge between these talented artisans and 
                conscious consumers worldwide who value authenticity, craftsmanship, and cultural heritage.
              </p>
              <p>
                What started as a small collection of handcrafted products from a few artisan families has grown into a thriving 
                platform representing hundreds of artisans from over 25 different tribal communities across India.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact Section */}
      <section className={styles.impactSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Our Impact</h2>
          
          <div className={styles.impactStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Artisans Supported</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>25+</span>
              <span className={styles.statLabel}>Tribal Communities</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>15</span>
              <span className={styles.statLabel}>Indian States</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>₹10M+</span>
              <span className={styles.statLabel}>Revenue Generated</span>
            </div>
          </div>
          
          <div className={styles.impactText}>
            <p>
              Beyond the numbers, our true impact lies in the stories of transformation. Artisans who once struggled to find 
              markets for their crafts now receive regular orders and fair compensation. Traditional art forms that were at risk 
              of disappearing are being revitalized as younger generations see value in continuing these cultural practices.
            </p>
            <p>
              We also invest in skill development workshops, provide access to better tools and materials, and help artisans 
              adapt their traditional designs for contemporary markets without compromising their cultural authenticity.
            </p>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className="container" >
          <h2 className={styles.sectionTitle}>Our Team</h2>
          
          <div className={styles.teamGrid} style={{alignItems:"center", display:"flex"}}>
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Amod Khurasiya" />
              </div>
              <h3>Amod Khurasiya</h3>
              <p className={styles.memberRole}>Founder & CEO</p>
              <p className={styles.memberBio}>
                With a background in social entrepreneurship and a passion for cultural preservation, 
                Aanya founded Trybe after extensive fieldwork with tribal communities.
              </p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Anuj Kori" />
              </div>
              <h3>Anuj Kori</h3>
              <p className={styles.memberRole}>Head of Operations</p>
              <p className={styles.memberBio}>
                Rahul oversees the logistics and operations, ensuring that products move smoothly 
                from artisan workshops to customers' doorsteps.
              </p>
            </div>
            
            <div className={styles.teamMember}>
              <div className={styles.memberImage}>
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Anshika Gupta" />
              </div>
              <h3>Anshika Gupta</h3>
              <p className={styles.memberRole}>Artisan Relations</p>
              <p className={styles.memberBio}>
                Priya works directly with artisan communities, building relationships and 
                helping them develop products for the marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section className={styles.joinSection}>
        <div className="container">
          <div className={styles.joinContent}>
            <h2>Join Our Journey</h2>
            <p>
              Be part of our mission to preserve cultural heritage and support tribal artisans. 
              Shop our products, follow our journey on social media, or get in touch to explore collaboration opportunities.
            </p>
            <div className={styles.joinButtons}>
              <Link to="/products" className={styles.shopButton}>Shop Tribal Products</Link>
              <Link to="/contact" className={styles.contactButton}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 