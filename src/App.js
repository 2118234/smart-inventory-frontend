import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className='container'>
        <h1>Smart Inventory System</h1>
        <Routes>
          {/* Home route now directly loads dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Login route still exists if you ever need it */}
          <Route path="/login" element={<Login />} />

          {/* Register route still exists */}
          <Route path="/register" element={<Register />} />

          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
