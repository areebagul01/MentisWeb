import React, { createContext, useState, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      // If there is a token, retrieve user data from localStorage and set it in state
      const storedUser = {
        email: localStorage.getItem('userEmail'),
        username: localStorage.getItem('username'),
        adhdtype: localStorage.getItem('adhdtype'),
        gender: localStorage.getItem('gender'),
        interests: JSON.parse(localStorage.getItem('interests')),
        userId: localStorage.getItem('userId'),
        token: token
      };
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Store user data in localStorage after login
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('adhdtype', userData.adhdtype);
    localStorage.setItem('gender', userData.gender);
    localStorage.setItem('interests', JSON.stringify(userData.interests));
    localStorage.setItem('userId', userData.userId);
  };

  const logout = () => {
    setUser(null);
    // Clear all user data from localStorage on logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('adhdtype');
    localStorage.removeItem('gender');
    localStorage.removeItem('interests');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };