import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopImage from '../assets/Top-removebg-preview.png';
import BottomImage from '../assets/Bottom-removebg-preview.png';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        email: email.trim().toLowerCase(),
        password: password.trim()
      };

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Store user data in localStorage
      localStorage.setItem('authToken', data.token); // Store JWT token
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('username', data.username);
      localStorage.setItem('adhdtype', data.adhdtype || '');
      localStorage.setItem('gender', data.gender || '');
      localStorage.setItem('interests', JSON.stringify(data.interests || []));
      localStorage.setItem('userId', data._id);  // Storing MongoDB ID

      // Redirect based on adhdtype
      if (data.adhdtype) {
        navigate('/tasks');
      } else {
        navigate('/questionnaire');
      }

    } catch (err) {
      setError(err.message);
      // Clear localStorage on error
      localStorage.removeItem('userEmail');
      localStorage.removeItem('username');
      localStorage.removeItem('adhdtype');
      localStorage.removeItem('gender');
      localStorage.removeItem('interests');
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken'); // Clear token as well
    }
  };

  return (
    <div className="auth-container">
      <img src={TopImage} alt="Decoration top" className="top-image" />
      
      <div className="auth-content">
        <h1>Welcome Back to Mentis</h1>
        <h2>Your Companion for ADHD Well-being</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
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
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="auth-button">
            Log In
          </button>
          <button 
            type="button"
            className="auth-button create-account-button"
            onClick={() => navigate('/signup')}
          >
            Create a new account
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

export default Login;