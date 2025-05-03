// components/Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Add logic to close sidebar if needed
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Mentis</h2>
      </div>
      
      <nav className="sidebar-nav">
        <button onClick={() => handleNavigation('/tasks')} className="nav-item">
          <i className="bi bi-list-task"></i>
          <span>Tasks</span>
        </button>
        
        <button onClick={() => handleNavigation('/interests')} className="nav-item">
          <i className="bi bi-heart"></i>
          <span>Edit Interests</span>
        </button>
        
        <button onClick={() => handleNavigation('/edit-profile')} className="nav-item">
          <i className="bi bi-person"></i>
          <span>Edit Profile</span>
        </button>
        
        <button onClick={handleLogout} className="nav-item logout-btn">
          <i className="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;