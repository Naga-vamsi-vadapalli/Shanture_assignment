import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', { description: newTask });
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed });
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src='https://media.licdn.com/dms/image/D560BAQHBSZ1Apw7WrQ/company-logo_200_200/0/1707289640489/shanture_logo?e=2147483647&v=beta&t=1n2hkowSufjEAGzBQLyMCLVtJcLr7RSf7dMKwZs57Ow' alt="Shanture Logo" className="logo" />
        <h1>To-Do List</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, !task.completed)}
              />
              <span>{task.description}</span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default App;
