import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "JohnDoe",
    age: 28,
    email: "john@example.com",
    interests: "Music, Reading, Hiking",
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // Simulate saving logic (e.g., API call)
    alert('Profile updated successfully!');
    // You can navigate or show success message here
  };

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
            <input
              type="text"
              name="username"
              className="input-field username-input"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              className="input-field age-input"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Interests</label>
        <textarea
          name="interests"
          className="input-field"
          value={formData.interests}
          onChange={handleChange}
          rows={3}
        />

        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
          />
          Enable Notifications
        </label>

        <label>
          <input
            type="checkbox"
            name="darkMode"
            checked={formData.darkMode}
            onChange={handleChange}
          />
          Enable Dark Mode
        </label>
      </div>

      <div className="button-section">
        <button className="edit-save-button" onClick={handleSave}>Save Changes</button>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default EditProfile;