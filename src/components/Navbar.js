// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-main">MENTIS</span>
          <span className="logo-tagline">ADHD Companion</span>
        </Link>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
          <Link to="/login" className="login-btn">Log In</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;