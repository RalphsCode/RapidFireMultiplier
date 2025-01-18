-- psql -U postgres -d rapidfiremultiplier -f 
-- /home/ralphscode/RalphsCode/Springboard/Capstone2/
-- capstone-project-two-1ef1c8247113478187f2e1e8c65becb1/RFM-BackEnd/seed.sql

-- Clear existing data to avoid duplication
TRUNCATE TABLE scores RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Seed data for users table
-- all seed passwords are "pass123"
INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES
('Testy', 'Test', 'User', 'testy@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG'),
('2Testy', 'Test', 'User2', '2testy@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG');

-- Seed data for scores table
INSERT INTO scores (user_id, episode_data, score, curr_hi_score, timestamp) VALUES
(1, 'Easy: 10 questions', 50, 80, '2025-01-18 10:15:00'),
(1, 'Medium: 20 questions', 60, 150, '2025-01-17 09:30:00'),
(2, 'Hard: 30 questions', 70, 300, '2025-01-18 14:00:00');