import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopImage from '../assets/Top-removebg-preview.png';
import BottomImage from '../assets/Bottom-removebg-preview.png';
import './Auth.css';

const SignUp = () => {
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic
    navigate('/questionnaire');
  };
  return (
    <div className="auth-container">
      <img src={TopImage} alt="Decoration top" className="top-image" />
      
      <div className="auth-content">
        <h1>Join Mentis</h1>
        <h2>Your Companion for ADHD Well-being</h2>

        <form className="auth-form">
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          
          <button type="submit" className="auth-button" onClick={handleSubmit}>
            Sign Up
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

export default SignUp;