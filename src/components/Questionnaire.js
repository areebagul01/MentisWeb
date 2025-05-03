import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Questionnaire.css';

const questions = [
    { featureIndex: 1, type: "Adulthood", text: "Do you talk excessively, even when it's not appropriate?" },
    { featureIndex: 2, type: "Childhood", text: "Do you find it hard to remain attentive when working on monotonous or repetitive tasks?" },
    { featureIndex: 3, type: "Adulthood", text: "Do you frequently misplace or forget scheduled appointments or plans?" },
    { featureIndex: 4, type: "Childhood", text: "Do you have difficulty following through on instructions and fail to complete tasks?" },
    { featureIndex: 5, type: "Adulthood", text: "Do you feel restless, like you always need to be on the move?" },
    { featureIndex: 6, type: "Childhood", text: "Do you often interrupt or intrude on others during conversations?" },
    { featureIndex: 7, type: "Adulthood", text: "Do you often avoid or delay starting tasks?" },
    { featureIndex: 8, type: "Childhood", text: "Do you have trouble organizing tasks and activities?" },
    { featureIndex: 9, type: "Adulthood", text: "Do you often leave your seat in situations where remaining seated is expected?" },
    { featureIndex: 10, type: "Childhood", text: "Do you struggle to wait your turn in conversations or activities?" },
    { featureIndex: 11, type: "Adulthood", text: "Do you often fail to give close attention to details or make careless mistakes in work or other activities?" },
    { featureIndex: 12, type: "Childhood", text: "Do you have difficulty sustaining attention in tasks or activities?" },
    { featureIndex: 13, type: "Adulthood", text: "Do you find it hard to control emotional reactions in stressful situations?" },
    { featureIndex: 14, type: "Childhood", text: "Do you frequently feel mentally overloaded or overwhelmed by tasks?" },
    { featureIndex: 15, type: "Adulthood", text: "Do you feel like you can't control racing thoughts or impulsive behaviors?" },
    { featureIndex: 16, type: "Childhood", text: "Do you often feel like you are driven by a motor, always needing to be busy?" },
    { featureIndex: 17, type: "Adulthood", text: "Do you have trouble staying seated in long meetings or gatherings?" },
    { featureIndex: 18, type: "Childhood", text: "Do you have difficulty managing time effectively, often running late or missing deadlines?" },
    { featureIndex: 19, type: "Adulthood", text: "Do you frequently lose items necessary for tasks or activities (e.g., keys, wallet, phone, etc.)?" },
    { featureIndex: 20, type: "Childhood", text: "Do you often forget to complete tasks you were assigned or promised to do?" },
    { featureIndex: 21, type: "Adulthood", text: "Do you frequently fidget with your hands or feet, or tap excessively?" },
    { featureIndex: 22, type: "Childhood", text: "Do you avoid or dislike tasks that require sustained mental effort?" },
    { featureIndex: 23, type: "Adulthood", text: "Do you find it challenging to prioritize tasks and focus on what’s most important?" },
    { featureIndex: 24, type: "Childhood", text: "Do you frequently get distracted by unrelated thoughts or external stimuli?" }
  ];

  const Questionnaire = () => {
    const navigate = useNavigate();
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [answers, setAnswers] = useState({});
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(0);
  
    const childhoodQuestions = questions.filter(q => q.type === 'Childhood');
    const adulthoodQuestions = questions.filter(q => q.type === 'Adulthood');
  
    const updateProgress = () => {
      const total = questions.length + 2; // +2 for gender + dob
      const answered = Object.keys(answers).length + (gender ? 1 : 0) + (dob ? 1 : 0);
      setProgress(answered / total);
    };
  
    const handleAnswer = (featureIndex, value) => {
      setAnswers(prev => ({ ...prev, [featureIndex]: value }));
      setErrors(prev => ({ ...prev, [featureIndex]: null }));
      updateProgress();
    };
  
    const diagnose = async () => {
      const newErrors = {};
      if (!gender) newErrors.gender = 'Gender is required';
      if (!dob) newErrors.dob = 'Date of Birth is required';
    
      questions.forEach(q => {
        if (answers[q.featureIndex] === undefined) {
          newErrors[q.featureIndex] = 'This question is required';
        }
      });
    
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    
      const data = {
        dob: dob,
        answers: questions.reduce((acc, q) => {
          acc[q.featureIndex] = answers[q.featureIndex] ? 1 : 0;
          return acc;
        }, {})
      };
    
      try {
        const response = await fetch('http://192.168.100.55:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    
        if (!response.ok) {
          throw new Error('Failed to connect to server');
        }
        else {
          console.log("Response received");
        }
    
        const resData = await response.json();
        const result = resData.result;
    
        const resultMap = ['Combined', 'False', 'Hyperactive', 'Inattentive'];
        const diagnosis = resultMap[result] || 'Unknown';
    
        localStorage.setItem('adhdtype', diagnosis);
        localStorage.setItem('dob', dob);
        localStorage.setItem('gender', gender);
    
        if (diagnosis === 'False') {
          alert('You do not have ADHD. Redirecting to launch screen.');
          navigate('/launch');
        } else {
          alert(`Diagnosis: ${diagnosis}`);
          navigate('/interests', {
            state: { fromQuestionnaire: true }
          });
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    };    
  
    return (
      <div className="questionnaire-container">
        <h1>ADHD Questionnaire</h1>
        {/* <progress value={progress} max={1}></progress> */}
  
        <form onSubmit={(e) => { e.preventDefault(); diagnose(); }}>
          {/* Personal Info */}
          <div className="section">
            <h2>Personal Information</h2>
  
            <div className="form-group">
              <label>Gender:</label>
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  setErrors(prev => ({ ...prev, gender: null }));
                  updateProgress();
                }}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
  
            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setErrors(prev => ({ ...prev, dob: null }));
                  updateProgress();
                }}
                className={errors.dob ? 'error' : ''}
              />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>
          </div>
  
          {/* Childhood */}
          <div className="section">
            <h2>Childhood Experiences (Before age 12)</h2>
            {childhoodQuestions.map((q) => (
              <div key={q.featureIndex} className="question-group">
                <p>{q.text}</p>
                <div className="button-group">
                  <button
                    type="button"
                    className={`answer-btn ${answers[q.featureIndex] === true ? 'selected' : ''}`}
                    onClick={() => handleAnswer(q.featureIndex, true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`answer-btn ${answers[q.featureIndex] === false ? 'selected' : ''}`}
                    onClick={() => handleAnswer(q.featureIndex, false)}
                  >
                    No
                  </button>
                </div>
                {errors[q.featureIndex] && (
                  <span className="error-message">{errors[q.featureIndex]}</span>
                )}
              </div>
            ))}
          </div>
  
          {/* Adulthood */}
          <div className="section">
            <h2>Adulthood Experiences (Last 6 Months)</h2>
            {adulthoodQuestions.map((q) => (
              <div key={q.featureIndex} className="question-group">
                <p>{q.text}</p>
                <div className="button-group">
                  <button
                    type="button"
                    className={`answer-btn ${answers[q.featureIndex] === true ? 'selected' : ''}`}
                    onClick={() => handleAnswer(q.featureIndex, true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`answer-btn ${answers[q.featureIndex] === false ? 'selected' : ''}`}
                    onClick={() => handleAnswer(q.featureIndex, false)}
                  >
                    No
                  </button>
                </div>
                {errors[q.featureIndex] && (
                  <span className="error-message">{errors[q.featureIndex]}</span>
                )}
              </div>
            ))}
          </div>
  
          <button type="submit" className="submit-btn">
            Get Diagnosis
          </button>
        </form>
      </div>
    );
  };
  
  export default Questionnaire;