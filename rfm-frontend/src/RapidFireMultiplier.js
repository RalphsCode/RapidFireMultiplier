import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameHistory from './GameHistory';
import { UpdateGameScore, UpdateUser } from './UpdateGameScore';

const RapidFireMultiplier = ({ isAuthenticated, toggleAuth }) => {
  const navigate = useNavigate();
  const levels = {
    1: { title: "Starter", time: 8, range1: [1, 9], range2: [1, 12], bonusPoints: 10 },
    2: { title: "Intermediate", time: 40, range1: [1, 20], range2: [1, 50], bonusPoints: 20 },
    3: { title: "Advanced", time: 45, range1: [10, 50], range2: [10, 100], bonusPoints: 30 },
  };

  // Refs
  const answerInputRef = useRef(null);
  const usernameInputRef = useRef(null);

  // State definitions
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [problem, setProblem] = useState({ num1: 0, num2: 0 });
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameData, setGameData] = useState([]);
  const [user, setUser] = useState({ username: '', isGuest: true });
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [hiScore, setHiScore] = useState(Number(localStorage.getItem('hiScore')) || 0);
  const [totalPoints, setTotalPoints] = useState(Number(localStorage.getItem('totalPoints')) || 0);

  const generateProblem = () => {
    const { range1, range2 } = levels[level];
    const num1 = Math.floor(Math.random() * (range1[1] - range1[0] + 1)) + range1[0];
    const num2 = Math.floor(Math.random() * (range2[1] - range2[0] + 1)) + range2[0];
    setProblem({ num1, num2 });
  };

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setScore(levels[selectedLevel].bonusPoints);
    setCorrectAnswers(0);
    setAttemptedQuestions(0);
    setGameData([]);
    setTimeLeft(levels[selectedLevel].time);
    setCountdown(3);
    setIsGameRunning(false);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsGameRunning(true);
          generateProblem();
          requestAnimationFrame(() => {
            if (answerInputRef.current) {
              answerInputRef.current.focus();
            }
          });
        }
        return prev - 1;
      });
    }, 800);
  };

  useEffect(() => {
    if (isGameRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameRunning) {
      const newTotalPoints = totalPoints + score;
      setTotalPoints(newTotalPoints);
      localStorage.setItem('totalPoints', newTotalPoints);

      if (score > hiScore) {
        setHiScore(score);
        localStorage.setItem('hiScore', score);
      }

      UpdateGameScore(user, level, gameData, score, hiScore, newTotalPoints);
      UpdateUser(user, hiScore, newTotalPoints);
      setIsGameRunning(false);
    }
  }, [isGameRunning, timeLeft, score, hiScore, user, level, gameData, totalPoints]);

  useEffect(() => {
    localStorage.setItem('totalPoints', totalPoints);
  }, [totalPoints]);

  const checkAnswer = () => {
    const correctAnswer = problem.num1 * problem.num2;
    const isCorrect = parseInt(userAnswer, 10) === correctAnswer;

    setGameData((prevData) => [
      ...prevData,
      {
        Q: `${problem.num1} x ${problem.num2}`,
        correctAnswer,
        entAns: userAnswer,
        level,
        isCorrect,
      },
    ]);

    setAttemptedQuestions((prev) => prev + 1);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setFeedback(
        <strong style={{ color: 'green' }}>
          ✔️ Correct!
        </strong>
      );
      setScore((prevScore) => prevScore + 10);
    } else {
      setFeedback(
        <strong style={{ color: 'red' }}>
          ❌ Incorrect! The correct answer was {correctAnswer}.
        </strong>
      );
    }

    setTimeout(() => setFeedback(''), 1500);
    setUserAnswer('');
    generateProblem();
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedTotalPoints = Number(localStorage.getItem('totalPoints')) || 0;
    if (storedUser) {
      setUser(storedUser);
      toggleAuth(true);
      setTotalPoints(storedTotalPoints);
    }
  }, []);

  const handleLogin = () => {
    const username = usernameInputRef.current?.value;
    if (username) {
      navigate('/login');
    }
  };

  const handleRegister = () => {
    const username = usernameInputRef.current?.value;
    if (username) {
      navigate('/login');
    }
  };

  const handleGuest = () => {
    setUser({ username: 'Guest', isGuest: true });
    toggleAuth(true);
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  };

  const cancelGame = () => {
    setIsGameRunning(false);
    setTimeLeft(null);
    setCountdown(3);
  };

  return (
    <div className="game-container">
      {!isAuthenticated && (
        <div className="auth-container">
          <h2>Login or Register</h2>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder="Enter username"
          />
          <button onClick={handleLogin}>
            Login
          </button>
          <button onClick={handleRegister}>
            Register
          </button>
          <button onClick={handleGuest}>Continue as Guest</button>
        </div>
      )}

      {isAuthenticated && !isGameRunning && timeLeft === null && (
        <div className="level-selector">
          <h2>Welcome, {user.username}!</h2>
          <h2>Select Level</h2>
          {Object.entries(levels).map(([lvl, { title }]) => (
            <button key={lvl} onClick={() => startGame(Number(lvl))}>{title}</button>
          ))}
        </div>
      )}

      {countdown > 0 && !isGameRunning && timeLeft !== null && (
        <div>
          <h2>Game starts in: {countdown}</h2>
          <h3>Hi Score: {hiScore}</h3>
        </div>
      )}

      {isGameRunning && (
        <div className="game">
          <h2>Level: {level}</h2>
          <h2>Time Left: {timeLeft} seconds</h2>
          <h2>Score: {score}</h2>
          <div className="stats">
            <h3>Problems Attempted: {attemptedQuestions}</h3>
            <h3>Correct Answers: {correctAnswers}</h3>
            <h3>Incorrect Answers: {attemptedQuestions - correctAnswers}</h3>
          </div>
          <div className="problem">
            <h3>{problem.num1} x {problem.num2}</h3>
            <input
              ref={answerInputRef}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            />
            <button onClick={checkAnswer}>Submit</button>
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
          <button onClick={cancelGame} className="cancel-button">End Game</button>
          <GameHistory gameData={gameData} />
        </div>
      )}

      {!isGameRunning && timeLeft === 0 && (
        <div className="game-over">
          <h2>Game Over {user.username}!</h2>
          <h3>{Math.round((correctAnswers / attemptedQuestions) * 100)}% Correct!</h3>
          <h3>Score: {score}</h3>
          <h3>High Score: {user.username === "Guest" ? " Register/Login for this feature" : hiScore}</h3>
          <h3>Total Points: {user.username === "Guest" ? " Register/Login for this feature" : totalPoints}</h3>
          <h3>Equations: {attemptedQuestions}</h3>
          <h3>Correct Answers: {correctAnswers}</h3>
          <h3>Incorrect Answers: {attemptedQuestions - correctAnswers}</h3>
          <button onClick={() => startGame(level)}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default RapidFireMultiplier;