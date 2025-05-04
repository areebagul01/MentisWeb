import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, isChecked, onCheck }) => {
  return (
    <div className={`task-card ${isChecked ? 'checked' : ''}`}>
      <div className="task-content">
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={(e) => onCheck(task, e.target.checked)}
        />
        <span className="task-text">{task}</span>
      </div>
    </div>
  );
};

export default TaskCard;