import React, { useState, useEffect } from 'react';
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

  const [isLoading, setIsLoading] = useState(true);
  const [initialInterests, setInitialInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        const response = await fetch(
          `http://localhost:5000/api/users/interests?email=${encodeURIComponent(userEmail)}`
        );
        
        if (!response.ok) throw new Error('Failed to load interests');
        
        const data = await response.json();
        setInitialInterests(data.interests);
        
        // Initialize selected state
        const initialSelection = interests.map(interest => 
          data.interests.includes(interest)
        );
        setSelectedInterests(initialSelection);
        
      } catch (err) {
        console.error('Interest load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterests();
  }, []);

  const toggleInterest = (index) => {
    const newSelection = [...selectedInterests];
    newSelection[index] = !newSelection[index];
    setSelectedInterests(newSelection);
  };

  if (isLoading) {
    return <div className="loading-container">Loading interests...</div>;
  }

  const handleSave = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('User session expired - please login again');
      }
  
      const interestSelected = interests
        .filter((_, index) => selectedInterests[index])
        .map((interest) => interest);
  
      if (interestSelected.length === 0) {
        alert('Please select at least one interest');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/auth/interests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          interestSelected 
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save interests');
      }
  
      // Store interests locally if needed
      localStorage.setItem('interests', JSON.stringify(interestSelected));
  
      // Navigate after successful save
      navigate(fromQuestionnaire ? '/tasks' : '/interests');
  
    } catch (err) {
      console.error(err);
      alert(err.message);
      if (err.message.includes('session expired')) {
        navigate('/login');
      }
    }
  };

  return (
    <div className={fromQuestionnaireToInterest ? "full-page" : ""}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="interests-container">
        <h1>Your Interests</h1>
        <div className="interests-grid">
          {interests.map((interest, index) => {
            const isVisible = interest.toLowerCase().includes(searchQuery.toLowerCase());
            
            return (
              <div 
                key={interest}
                className={`interest-card ${selectedInterests[index] ? 'selected' : ''} ${
                  !isVisible ? 'hidden' : ''
                }`}
                onClick={() => toggleInterest(index)}
              >
                <div className="card-image">
                  <img
                    src={`/images/interests/${interest.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and')}.jpg`}
                    alt={interest}
                    className={`interest-image ${selectedInterests[index] ? 'selected' : ''}`}
                  />
                </div>
                <div className={`card-overlay ${selectedInterests[index] ? 'active' : ''}`}></div>
                <h3 className="interest-title">{interest}</h3>
              </div>
            );
          })}
        </div>
        <button className="save-button" onClick={handleSave}>
          {initialInterests.length > 0 ? 'Update Interests' : 'Save Interests'}
        </button>
      </div>
      {fromQuestionnaireToInterest && <h2>Finalize Your Preferences</h2>}
    </div>
  );
};

export default Interests;