import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ isAuthenticated, toggleAuth }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username,
        password,
      });

      const { 
        username: responseUsername, 
        curr_hi_score, 
        total_points,
        first_name,
        last_name,
        email 
      } = response.data;

      // Store user data
      const userData = {
        username: responseUsername,
        isGuest: false,
        firstName: first_name,
        lastName: last_name,
        email: email
      };

      // Set localStorage items
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('hiScore', curr_hi_score || 0);
      localStorage.setItem('totalPoints', total_points || 0);

      // Update authentication state
      toggleAuth(true);

      // Clear form
      setUsername('');
      setPassword('');

      // Redirect to home page
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;