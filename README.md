# RalphsCode Capstone Two
Start up and config settings below

## Rapid Fire Multiplier game

This project is a multiplication game with user sign-in, allowing players to track their scores and high scores. User data and game history will be managed within a Postgres database via Supabase.
Gameplay involves a series of multiplication problems, with immediate visual feedback (red/green) indicating answer correctness. The next problem appears after a one-second delay, continuing until the timer runs out.

## The application has 2 parts
(1) the FrontEnd built with React (CRA) with is the user facing part of the project.
(2) the Backend built with Node and Express, which is an API server providing the connection between the frontend and the SQL database.

# FrontEnd
in the directory:   rfm-frontend\n
Run:                npm start\n
Site runs on port:  3000

# SQL Database
There is a seed file in the directory: RFM-BackEnd \n
The URI path should be defined in the .env file

# BackEnd/API server
The Backend runs on Node \n
In the directory:   RFM-BackEnd \n
Run:                npx nodemon \n
Site runs on port:  3001

## Project Description:
This capstone project aims to develop an engaging and educational multiplication game designed to practice and improve users' multiplication skills. The game will feature three difficulty levels:
Starter: Multiplication tables (single-digit numbers). For example: 5 * 6 =
Intermediate: Single-digit numbers multiplied by 1-2 digit numbers. For example: 7 * 23 =
Advanced: Double-digit numbers multiplied by double digit numbers. For example: 12 * 24 = 

## Key Features:
# User Authentication: 
Users can create accounts and securely sign in.
# Personalized Progress Tracking:
Store user scores (high scores and past scores) in a Postgres database using Supabase.
Display user-specific performance history.
# Timed Gameplay:
Engage users in a fast-paced and challenging game.
# Immediate Feedback:
Provide instant visual feedback (green for correct, red for incorrect) upon answer submission.
Seamlessly transition to the next problem.

## Technology:

Frontend: React for a dynamic and interactive user interface.
Backend: React, Express, SQL, Supabase for database management (Postgres) and authentication.
Styling: ReactStrap for a visually appealing design.

## Project Scope:

# Core Functionality:
User registration, login, and logout.
Game logic for all three difficulty levels.
Timer implementation.
Score calculation and storage.
Display of past scores and high scores.
# User Interface:
Intuitive and user-friendly design.
Clear instructions and visual cues.
Engaging game aesthetics.
# Testing:
Testing of game features and functionality.
# Deployment:
The game will be deployed on Render.com.

## More Gameplay Details:
Include a countdown before the game starts.
Display a progress bar to show how much time is left, possibly adjusting time limits based on the difficulty level.
Display current score, how many problems are completed, and number of correct answers.
Show the correct answer briefly when the user gets it wrong.
Cache problems locally to reduce database load
Display a summary screen after each session showing:
Total problems attempted
Accuracy percentage
Implement keyboard support for faster input (Enter to submit, number keys for answers).
Display a global leaderboard



## Potential Enhancements:
Add a global or friend-based leaderboard.
Incorporate rewards, badges, or achievements to motivate users.  (e.g., "Speed Demon", "Perfect Score", "Practice Makes Perfect").
Adaptive Difficulty: Adjust the difficulty level dynamically based on user performance.
Multiplayer Mode: Allow users to compete against each other online.
Add a "practice mode" without time pressure where users can focus on learning
Add system learning on the backend to track which problems are more complicated than others, and integrate that complexity factor into the game based on the users skills. Ie: Implement an algorithm to adjust the difficulty level based on the user's performance.
Adding sound effects for correct/incorrect answers.
Implement error handling for network issues during gameplay.
Include an option to challenge friends
Share achievements on social media
Create class/group features for educational settings
Notify users when time is almost up (e.g., last 10 seconds).
Reward points based on speed and accuracy.
Reward bonus points for streaks of correct answers.
Add a different version of the game that is a ‘streak length’ game - what is the longest streak a user can get in a 3 minute window. Have scoreboard, leaderboard, etc.
Allow users to reset their passwords via email.
Enable social logins (Google, GitHub, etc.) for convenience.
Include a dark mode option.

