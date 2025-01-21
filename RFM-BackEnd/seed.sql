-- psql -U postgres -d rapidfiremultiplier -f 
-- /home/ralphscode/RalphsCode/Springboard/Capstone2/
-- capstone-project-two-1ef1c8247113478187f2e1e8c65becb1/RFM-BackEnd/seed.sql

-- First connect to a different database
\c postgres;

-- Drop and recreate the database
DROP DATABASE IF EXISTS rapidfiremultiplier;
CREATE DATABASE rapidfiremultiplier;

-- Now connect to the newly created database
\connect rapidfiremultiplier;

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    curr_hi_score INT DEFAULT 0,
    total_points INT DEFAULT 0
);

-- Create the scores table
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    difficulty INT DEFAULT 1,
    score INT NOT NULL,
    total_points INT DEFAULT 0,
    curr_hi_score INT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    q_and_a TEXT NOT NULL   
);

-- Seed data for users table
-- all seed passwords are "pass123"
INSERT INTO users (username, first_name, last_name, email, password_hash, curr_hi_score, total_points) VALUES
('Guest', 'Guest', 'CatchAll', 'guest@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG', 80, 180),
('Testy', 'Test', 'User', 'testy@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG', 80, 180),
('2Testy', 'Test', 'User2', '2testy@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG', 100, 100);

-- Seed data for scores table
-- q_and_a code: ( Question#, 1stNum, 2ndNum, correct_answer, answer_entered, 1=correct 0=incorrect :)
INSERT INTO scores (user_id, q_and_a, score, curr_hi_score, total_points, timestamp, difficulty) VALUES
(1, '1,10,2,20,20,1:2,3,2,6,6,1:', 50, 80, 100, '2025-01-18 10:15:00',1),
(1, '1,10,2,20,20,1:2,3,2,6,6,1:', 60, 80, 180, '2025-01-17 09:30:00',2),
(2, '1,10,2,20,20,1:2,3,2,6,6,1:', 70, 100, 100, '2025-01-18 14:00:00',3);

-- Queries
-- SELECT users.username, score, scores.curr_hi_score, users.curr_hi_score, users.total_points FROM scores JOIN users ON scores.user_id = users.id;