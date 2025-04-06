import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Interests.css';

const Interests = ({ fromQuestionnaire }) => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState(
    Array(13).fill(false)
  );

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

  const handleSave = () => {
    // Navigation logic
    if (fromQuestionnaire) {
      navigate('/main');
    } else {
      navigate('/settings');
    }
  };

  return (
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
  );
};

export default Interests;