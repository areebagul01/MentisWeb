import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userEmail = localStorage.getItem('userEmail');
  return userEmail ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;