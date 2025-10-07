import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');

    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Verify authentication with backend using cookie
    verifyAuth();
  }, [navigate]);

  const verifyAuth = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/me');
      setUser(response.data);
      // Update localStorage with latest user data
      localStorage.setItem('user', JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      // User is not authenticated or cookie expired
      console.error('Authentication failed:', err);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Brotherhood Dashboard</h1>
        <div className="header-right">
          <span className="username">@{user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome, {user?.first_name} {user?.last_name}!</h2>
          <div className="user-info">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Member since:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="card">
            <h3>Quick Actions</h3>
            <ul>
              <li>View Profile</li>
              <li>Settings</li>
              <li>Analytics</li>
            </ul>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <p>No recent activity to display</p>
          </div>

          <div className="card">
            <h3>Statistics</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;