import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopImage from '../assets/Top-removebg-preview.png';
import BottomImage from '../assets/Bottom-removebg-preview.png';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: name,  // Add username field
          email, 
          password 
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Signup failed');
  
      // Store user data and redirect
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('username', data.username);
      navigate('/questionnaire');
  
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <img src={TopImage} alt="Decoration top" className="top-image" />
      
      <div className="auth-content">
        <h1>Join Mentis</h1>
        <h2>Your Companion for ADHD Well-being</h2>

       <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">
            Sign Up
          </button>
          <button 
            type="button"
            className="auth-button create-account-button"
            onClick={() => navigate('/login')}
          >
            Login to existing account
          </button>
        </form>

        {/* <div className="google-auth">
          <button className="google-button">
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" 
                 alt="Google logo" />
            Continue with Google
          </button>
        </div> */}
      </div>

      <img src={BottomImage} alt="Decoration bottom" className="bottom-image" />
    </div>
  );
};

export default SignUp;