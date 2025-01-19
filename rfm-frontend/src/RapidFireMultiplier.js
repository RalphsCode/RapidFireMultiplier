import React, { useState, useEffect, useRef } from 'react';

const RapidFireMultiplier = () => {
  const levels = {
    starter: { time: 35, range1: [1, 9], range2: [1, 12], bonusPoints: 10 },
    intermediate: { time: 40, range1: [1, 20], range2: [1, 50], bonusPoints: 20 },
    expert: { time: 45, range1: [10, 50], range2: [10, 100], bonusPoints: 30 },
  };

  // useState definitions
  const [level, setLevel] = useState('starter');
  const [timeLeft, setTimeLeft] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [problem, setProblem] = useState({ num1: 0, num2: 0 });
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameData, setGameData] = useState([]);   // API ****************
  const [user, setUser] = useState({ username: '', isGuest: true }); // SS *************
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [hiScore, setHiScore] = useState(Number(sessionStorage.getItem('hiScore')) || 0); // SS **************
  // useRef for the answer
  const answerInputRef = useRef(null);

  // Generate a single question/equation/problem
  const generateProblem = () => {
    const { range1, range2 } = levels[level];
    const num1 = Math.floor(Math.random() * (range1[1] - range1[0] + 1)) + range1[0];
    const num2 = Math.floor(Math.random() * (range2[1] - range2[0] + 1)) + range2[0];
    setProblem({ num1, num2 });
  };

  // Set up a game/round
  const startGame = (selectedLevel) => {
    // Set the useState variables
    setLevel(selectedLevel);
    setScore(0);
    setCorrectAnswers(0);
    setAttemptedQuestions(0);
    setGameData([]);
    setTimeLeft(levels[selectedLevel].time);
    setCountdown(3);
    setIsGameRunning(false);

    // Pre-game countdown, and initiates a game
    const countdownInterval = setInterval(() => {
      // Use a useState updater function to manage the countdown
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsGameRunning(true);
          generateProblem();
          setTimeout(() => answerInputRef.current?.focus(), 0);
        }
        return prev - 1;
      });
      // Adjust the countdown speed as needed
    }, 800);
  };

  useEffect(() => {
    // Create a new timer every second, until reach the limit of seconds for a game
    if (isGameRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Timer expired, conclude the game
      setIsGameRunning(false);
      // Check if the current score is higher than the hiScore
      if (score > hiScore) {
        setHiScore(score);
        // Store the new Hi Score in sessionStorage
        sessionStorage.setItem('hiScore', score);  
      }
    } // END else...if
  }, [isGameRunning, timeLeft, score, hiScore]);

  // Process a generated game question, and answer
  const checkAnswer = () => {
    const correctAnswer = problem.num1 * problem.num2;
    const isCorrect = parseInt(userAnswer, 10) === correctAnswer;
    // Update the gameData with the question/problem/equation
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

    // Update the number of attemptedQuestions
    setAttemptedQuestions((prev) => prev + 1);

    // User feedback
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! The correct answer was ${correctAnswer}.`);
    }

    // Update the score when a question is answered
    const baseScore = (correctAnswers + (isCorrect ? 1 : 0)) * 10;
    const bonus = levels[level].bonusPoints;
    setScore(baseScore + bonus);

    // Display the Feedback (adjust time as needed)
    setTimeout(() => setFeedback(''), 2000);

    // Reset the input & generate a new question
    setUserAnswer('');
    generateProblem();
  };

  // ======================= USER ================================
  // *** LOGIN a user ***
  const handleLogin = (username) => {
    setUser({ username, isGuest: false });
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify({ username, isGuest: false }));
  };

  // *** REGISTER a user ***
  const handleRegister = (username) => {
    handleLogin(username);
  };

  // *** Guest ***
  const handleGuest = () => {
    setUser({ username: 'Guest', isGuest: true });
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify({ username: 'Guest', isGuest: true }));
  };

  // *** ONCE USER EXISTS ***
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);
  // ======================= END USER ================================

  // Cancel game early
  const cancelGame = () => {
    setIsGameRunning(false);
    setTimeLeft(null);
    setCountdown(3);
  };

  // Send the game data to the database via API
  const updateGameScore = async () => {
    const scoreData = {
      difficulty: level,
      q_and_a: gameData,
      score: score,
      curr_hi_score: hiScore,
    };
    console.log("JSON data:", JSON.stringify(scoreData));

    try {
      const response = await fetch(`http://localhost:3001/data/${user.username}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Game score updated successfully', result);
      } else {
        console.error('Error updating score');
      }
    } catch (error) {
      console.error('Error with API request:', error);
    }
  };

  // Use useEffect to trigger API call when game ends
  useEffect(() => {
    if (!isGameRunning && timeLeft === 0) {
      updateGameScore();
    }
  }, [isGameRunning, timeLeft, gameData, score, hiScore]);

  // START RETURN

  return (
    <div className="game-container">
      <h1>Rapid Fire Multiplier</h1>

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
        <div>
          <h2>Game starts in: {countdown}</h2>
          <h3>Hi Score: {hiScore}</h3> {/* Display Hi Score during countdown */}
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
          <h3>Hi Score: {hiScore}</h3> {/* Display Hi Score on game over */}
          <button onClick={() => startGame(level)}>Play Again</button>
          <pre>{JSON.stringify(gameData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RapidFireMultiplier;
