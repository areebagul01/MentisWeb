import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import './DailyTasks.css';

const DailyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  //const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const cachedDate = localStorage.getItem('taskDate');
        const today = new Date().toISOString().split('T')[0];
        
        if (cachedDate === today) {
          const cachedTasks = JSON.parse(localStorage.getItem('dailyTasks') || []);
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
        localStorage.setItem('dailyTasks', JSON.stringify(data.daily_tasks));
        localStorage.setItem('taskDate', today);
        setTasks(data.daily_tasks);
      } catch (err) {
        //setError(err.message);
        alert('Error: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  //if (error) return <ErrorPopup message={error} onRetry={() => window.location.reload()} />;
  
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