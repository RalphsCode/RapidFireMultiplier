import React from 'react';
import './GameNavBar.css'; // Import the CSS file for styling

const GameNavbar = ({ onLogin = () => {}, onRegister = () => {} }) => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('hiScore');
    localStorage.removeItem('totalPoints');
    window.location.reload(); // Refresh the page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Rapid Fire Multiplier</div>
      <div className="navbar-links">
        {storedUser && storedUser.username !== 'Guest' ? (
          <>
            <span className="welcome-text">
              Welcome, {storedUser.username}!
            </span>
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn register-btn" onClick={onRegister}>
              Register
            </button>
            <button className="btn login-btn" onClick={onLogin}>
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default GameNavbar;
