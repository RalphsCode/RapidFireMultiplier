import React, { useState, useEffect, useRef } from 'react';

const RapidFireMultiplier = () => {
  const levels = {
    starter: { time: 35, range1: [1, 9], range2: [1, 12], bonusPoints: 10 },
    intermediate: { time: 40, range1: [1, 20], range2: [1, 50], bonusPoints: 20 },
    expert: { time: 45, range1: [10, 50], range2: [10, 100], bonusPoints: 30 },
  };

  const [level, setLevel] = useState('starter');
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [problem, setProblem] = useState({ num1: 0, num2: 0 });
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameData, setGameData] = useState([]);
  const [user, setUser] = useState({ username: '', isGuest: true });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const answerInputRef = useRef(null);

  const generateProblem = () => {
    const { range1, range2 } = levels[level];
    const num1 = Math.floor(Math.random() * (range1[1] - range1[0] + 1)) + range1[0];
    const num2 = Math.floor(Math.random() * (range2[1] - range2[0] + 1)) + range2[0];
    setProblem({ num1, num2 });
  };

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setScore(0);
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
          setTimeout(() => answerInputRef.current?.focus(), 0);
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isGameRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsGameRunning(false);
    }
  }, [isGameRunning, timeLeft]);

  const checkAnswer = () => {
    const correctAnswer = problem.num1 * problem.num2;
    const isCorrect = parseInt(userAnswer, 10) === correctAnswer;

    setGameData((prevData) => [
      ...prevData,
      {
        question: `${problem.num1} x ${problem.num2}`,
        correctAnswer,
        enteredAnswer: userAnswer,
        level,
        isCorrect,
      },
    ]);

    setAttemptedQuestions((prev) => prev + 1);

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! The correct answer was ${correctAnswer}.`);
    }

    const baseScore = (correctAnswers + (isCorrect ? 1 : 0)) * 10;
    const bonus = levels[level].bonusPoints;
    setScore(baseScore + bonus);

    setTimeout(() => setFeedback(''), 2000);

    setUserAnswer('');
    generateProblem();
  };

  const handleLogin = (username) => {
    setUser({ username, isGuest: false });
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify({ username, isGuest: false }));
  };

  const handleRegister = (username) => {
    handleLogin(username);
  };

  const handleGuest = () => {
    setUser({ username: 'Guest', isGuest: true });
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const cancelGame = () => {
    setIsGameRunning(false);
    setTimeLeft(null);
    setCountdown(3);
  };

  return (
    <div className="game-container">
      <h1>Rapid Fire Multiplication</h1>

      {!isAuthenticated && (
        <div className="auth-container">
          <h2>Login or Register</h2>
          <input
            type="text"
            placeholder="Enter username"
            id="username-input"
          />
          <button onClick={() => handleLogin(document.getElementById('username-input').value)}>
            Login
          </button>
          <button onClick={() => handleRegister(document.getElementById('username-input').value)}>
            Register
          </button>
          <button onClick={handleGuest}>Continue as Guest</button>
        </div>
      )}

      {isAuthenticated && !isGameRunning && timeLeft === null && (
        <div className="level-selector">
          <h2>Welcome, {user.username}!</h2>
          <h2>Select Level</h2>
          {Object.keys(levels).map((lvl) => (
            <button key={lvl} onClick={() => startGame(lvl)}>{lvl}</button>
          ))}
        </div>
      )}

      {countdown > 0 && !isGameRunning && timeLeft !== null && (
        <h2>Game starts in: {countdown}</h2>
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
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              ref={answerInputRef}
            />
            <button onClick={checkAnswer}>Submit</button>
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
          <button onClick={cancelGame} className="cancel-button">End Game</button>
        </div>
      )}

      {!isGameRunning && timeLeft === 0 && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <h3>Your Score: {score}</h3>
          <h3>Total Problems Attempted: {attemptedQuestions}</h3>
          <h3>Correct Answers: {correctAnswers}</h3>
          <h3>Incorrect Answers: {attemptedQuestions - correctAnswers}</h3>
          <button onClick={() => startGame(level)}>Play Again</button>
          <pre>{JSON.stringify(gameData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RapidFireMultiplier;
