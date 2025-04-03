import React from 'react';
import TopImage from '../assets/Top-removebg-preview.png';
import BottomImage from '../assets/Bottom-removebg-preview.png';
import './Auth.css';

const Login = () => {
  return (
    <div className="auth-container">
      <img src={TopImage} alt="Decoration top" className="top-image" />
      
      <div className="auth-content">
        <h1>Welcome Back to Mentis</h1>
        <h2>Your Companion for ADHD Well-being</h2>

        <form className="auth-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          
          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        <div className="google-auth">
          <button className="google-button">
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" 
                 alt="Google logo" />
            Continue with Google
          </button>
        </div>
      </div>

      <img src={BottomImage} alt="Decoration bottom" className="bottom-image" />
    </div>
  );
};

export default Login;