import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import './DailyTasks.css';

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const today = new Date().toISOString().split('T')[0];
        
        // User-specific cache keys
        const cacheKeys = {
          date: `${userEmail}_taskDate`,
          tasks: `${userEmail}_dailyTasks`
        };

        const cachedDate = localStorage.getItem(cacheKeys.date);
        const cachedTasks = JSON.parse(localStorage.getItem(cacheKeys.tasks) || '[]');

        if (cachedDate === today && cachedTasks.length > 0) {
          setTasks(cachedTasks);
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://192.168.100.55:8000/daily-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            adhd_type: localStorage.getItem('adhdtype'),
            interests: JSON.parse(localStorage.getItem('interests'))
          })
        });

        const data = await response.json();
        
        // Store with user-specific keys
        localStorage.setItem(cacheKeys.tasks, JSON.stringify(data.daily_tasks));
        localStorage.setItem(cacheKeys.date, today);
        
        setTasks(data.daily_tasks);
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="daily-tasks-container">
      <h2>Daily Tasks</h2>
      <div className="task-date">
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        })}
      </div>
      
      {isLoading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyTasks;