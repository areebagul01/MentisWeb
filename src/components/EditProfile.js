import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [user] = useState({
    username: "JohnDoe",
    info: "28M • Combined",
    email: "john@example.com"
  });

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="settings-container">
      <div className="profile-section">
        <div className="avatar-container">
          <div className="avatar-placeholder">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="user-info">
            <h2 className="username">{user.username}</h2>
            <p className="user-details">{user.info}</p>
          </div>
        </div>
      </div>

      <div className="settings-list">
        
        <div className="setting-item" onClick={() => navigate('/edit-profile')}>
          <i className="bi bi-pencil-square"></i>
          <span>Edit Profile</span>
        </div>

        <div className="setting-item" onClick={() => navigate('/about')}>
          <i className="bi bi-pencil-square"></i>
          <span>About & Support</span>
        </div>

      </div>

      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default EditProfile;