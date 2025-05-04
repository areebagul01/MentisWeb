import React, { useEffect, useState } from "react";
import "./EditProfile.css";

const EditProfile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState("Loading...");
  const [userInfo, setUserInfo] = useState("Loading...");

  useEffect(() => {
    // Simulate fetching from local storage and backend
    const fetchUserDetails = async () => {
      const email = localStorage.getItem("userEmail");

      if (email) {
        // Replace this with actual API call
        const mockData = {
          username: "Noor",
          dateOfBirth: "2002-06-01",
          gender: "Female",
          adhdtype: "Inattentive",
        };

        const dob = new Date(mockData.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        if (
          today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ) {
          age--;
        }

        const genderInitial = mockData.gender.charAt(0).toUpperCase();
        const adhdType = mockData.adhdtype;

        setUsername(mockData.username);
        setUserInfo(`${age}${genderInitial} • ${adhdType}`);
      } else {
        setUsername("Not logged in");
        setUserInfo("Unknown details");
      }
    };

    fetchUserDetails();
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-theme", !isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/"; // Redirect to login or landing page
  };

  return (
    <div className="edit-profile-container">
      <div className="profile-background" />
      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2 className="username">{username}</h2>
          <p className="user-info">{userInfo}</p>
        </div>

        <div className="setting-row">
          <span className="setting-label">Mode</span>
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Replace the settings-options div with this: */}
        <div className="edit-fields">
          <label className="edit-label">
            Name
            <input
              type="text"
              className="edit-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="edit-label">
            Email
            <input
              type="email"
              className="edit-input"
              value={localStorage.getItem("userEmail") || ""}
              disabled // if you want to make it editable, remove this line
            />
          </label>

          <label className="edit-label">
            Age
            <input
              type="number"
              className="edit-input"
              value={userInfo.match(/\d+/)?.[0] || ""}
              onChange={(e) => {
                const updatedInfo = userInfo.replace(/\d+/, e.target.value);
                setUserInfo(updatedInfo);
              }}
            />
          </label>
        </div>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default EditProfile;