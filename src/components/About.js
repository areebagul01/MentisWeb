import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Understanding ADHD Differently</h1>
          <p>Empowering individuals through personalized ADHD management</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p className="mission-statement">
            At Mentis, we're redefining ADHD care by combining cutting-edge technology 
            with psychological expertise to create personalized management strategies 
            that actually work.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Users Empowered</p>
            </div>
            <div className="stat-item">
              <h3>93%</h3>
              <p>Reported Improvement</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Expert Strategies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="value-proposition">
        <h2>Why Choose Mentis?</h2>
        <div className="value-grid">
          <div className="value-card">
            <div className="icon-box">🧠</div>
            <h3>Science-Backed Approach</h3>
            <p>Developed in collaboration with neurodiversity experts and clinical psychologists</p>
          </div>
          <div className="value-card">
            <div className="icon-box">🎯</div>
            <h3>Personalized Plans</h3>
            <p>Custom strategies based on your unique ADHD profile and personal interests</p>
          </div>
          <div className="value-card">
            <div className="icon-box">🤝</div>
            <h3>Community Support</h3>
            <p>Connect with others who understand the ADHD journey</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <h2>Start Your ADHD Journey Today</h2>
        <Link to="/signup" className="cta-button">Get Started</Link>
      </section>
    </div>
  );
}

export default About;