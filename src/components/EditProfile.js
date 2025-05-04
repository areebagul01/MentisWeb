// EditProfile.jsx
import React, { useEffect, useState } from "react";
import "./EditProfile.css";

const EditProfile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [adhdType, setAdhdType] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/user?email=${userEmail}`
        );
        
        if (!response.ok) {
          const errorData = await response.json(); // Need to await the JSON parsing
          console.error('Server Error:', errorData.message || 'No error message provided');
          console.log(response.status);
          throw new Error(errorData.message || 'Failed to fetch user details');
        }
        
        const userData = await response.json();
        setUsername(userData.username);
        setEmail(userData.email);
        setDateOfBirth(userData.dateOfBirth?.split("T")[0] || "");
        setGender(userData.gender || "");
        setAdhdType(userData.adhdtype || "");
      } catch (error) {
        alert("Error loading profile: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          username,
          dateOfBirth,
          gender
        })
      });

      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-theme", !isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="edit-profile-container">
      <div className="profile-background" />
      <div className="profile-content">
        <div className="avatar-section">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2 className="username">{username}</h2>
          <p className="user-info">
            {calculateAge(dateOfBirth)}
            {gender ? gender.charAt(0).toUpperCase() : ""} • {adhdType}
          </p>
        </div>

        <div className="setting-row">
          <span className="setting-label">Mode</span>
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={handleThemeToggle} />
            <span className="slider round"></span>
          </label>
        </div>

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
              value={email}
              disabled
            />
          </label>

          <label className="edit-label">
            Date of Birth
            <input
              type="date"
              className="edit-input"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </label>

          <label className="edit-label">
            Gender
            <select
              className="edit-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        {/* <div className="button-group"> */}
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
          <button className="save-button" onClick={handleLogout}>
            Logout
          </button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default EditProfile;