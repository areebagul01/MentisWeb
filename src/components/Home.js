// Home.js
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your ADHD Journey</h1>
          <p>Personalized diagnosis and tailored strategies for better focus and mental well-being</p>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Personalized Diagnosis</h3>
          <p>Take our comprehensive questionnaire to understand your unique ADHD profile</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Customized Tasks</h3>
          <p>Get tailored daily tasks based on your diagnosis and personal interests</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your improvements and stay motivated with our tracking system</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About Mentis</h4>
            <p>Empowering individuals with ADHD through personalized care and innovative solutions</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/about">About Us</Link>
            <Link>Contact</Link>
            <Link>Privacy Policy</Link>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@mentis.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Mentis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;