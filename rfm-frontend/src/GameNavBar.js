import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GameNavBar.css'; 

const GameNavBar = () => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || null;

  const navigate = useNavigate();

  const onLogin = () => {
    navigate('/Login'); 
  };

  const onRegister = () => {
    navigate('/Register'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('hiScore');
    localStorage.removeItem('totalPoints');
     // Refresh the page after logout
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand"><Link to="/" >Rapid Fire Multiplier</Link></div>
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

export default GameNavBar;
