import React, { useState } from 'react';
import './TaskCard.css';

const TaskCard = ({ task }) => {
  const [checked, setChecked] = useState(false);
  //const [reaction, setReaction] = useState(null);

  return (
    <div className={`task-card ${checked ? 'checked' : ''}`}>
      <div className="task-content">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span className="task-text">{task}</span>
      </div>
      
      {/* <div className="task-reactions">
        <button
          className={`reaction-btn ${reaction === 'like' ? 'active' : ''}`}
          onClick={() => setReaction(reaction === 'like' ? null : 'like')}
        >
          👍
        </button>
        <button
          className={`reaction-btn ${reaction === 'dislike' ? 'active' : ''}`}
          onClick={() => setReaction(reaction === 'dislike' ? null : 'dislike')}
        >
          👎
        </button>
      </div> */}
    </div>
  );
};

export default TaskCard;