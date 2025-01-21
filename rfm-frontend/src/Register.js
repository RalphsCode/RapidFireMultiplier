import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ isAuthenticated, toggleAuth }) {
  const navigate = useNavigate();
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        username: inputUsername,
        password: inputPassword,
        first_name: inputFirstName,
        last_name: inputLastName,
        email: inputEmail,
      });

      const { username, curr_hi_score, total_points, first_name, last_name, email } = response.data.user;

      // Store user data
      const userData = {
        username,
        isGuest: false,
        firstName: first_name,
        lastName: last_name,
        email,
      };

      // Set localStorage items
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('hiScore', curr_hi_score || 0);
      localStorage.setItem('totalPoints', total_points || 0);

      // Update authentication state
      toggleAuth(true);

      // Clear form
      setInputUsername('');
      setInputPassword('');
      setInputFirstName('');
      setInputLastName('');
      setInputEmail('');

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 400) {
        setError('User already exists');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
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
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
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
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={inputFirstName}
            onChange={(e) => setInputFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            value={inputLastName}
            onChange={(e) => setInputLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
