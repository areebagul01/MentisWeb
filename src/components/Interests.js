import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Interests.css';

const Interests = ({ fromQuestionnaire }) => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState(
    Array(13).fill(false)
  );

  // For Interest page along with Sidebar
  const location = useLocation();
  const fromQuestionnaireToInterest = location.state?.fromQuestionnaire;

  const interests = [
    'Physical Activity', 'Music', 'Games', 'Art And Creativity', 'Nature & Outdoors',
    'Technology', 'Cooking & Food', 'Organization & Planning', 'Reading & Writing',
    'Strategy & Logic', 'Sensory & Mindfulness', 'Movement-Based Focus', 'Hands-on & Experiments',
  ];

  const toggleInterest = (index) => {
    const newSelection = [...selectedInterests];
    newSelection[index] = !newSelection[index];
    setSelectedInterests(newSelection);
  };

  const handleSave = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const interestSelected = interests
        .filter((_, index) => selectedInterests[index])
        .map((interest) => interest);
  
      const response = await fetch('http://localhost:5000/api/users/interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          interestSelected 
        }),
      });
  
      if (!response.ok) throw new Error('Failed to save interests');
  
      // Navigate after successful save
      if (fromQuestionnaire) {
        navigate('/tasks');
      } else {
        navigate('/settings');
      }
  
    } catch (err) {
      console.error(err);
      alert('Failed to save interests');
    }
  };

  return (
    <div className={fromQuestionnaireToInterest ? "full-page" : ""}>
      <div className="interests-container">
        <h1>Select Your Interests</h1>
        <div className="interests-grid">
          {interests.map((interest, index) => (
          <div 
            key={interest}
            className={`interest-card ${selectedInterests[index] ? 'selected' : ''}`}
            onClick={() => toggleInterest(index)}
          >
            <div className="card-image">
              <img
                src={`/images/interests/${interest.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and')}.jpg`}
                alt={interest}
                className="interest-image"
              />
            </div>
            <div className="card-overlay"></div>
            <h3 className="interest-title">{interest}</h3>
          </div>
          ))}
        </div>
        <button className="save-button" onClick={handleSave}>
          Save Interests
        </button>
      </div>
      {fromQuestionnaireToInterest && <h2>Finalize Your Preferences</h2>}
    </div>
  );
};

export default Interests;