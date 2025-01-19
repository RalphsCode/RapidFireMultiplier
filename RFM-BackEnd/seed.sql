-- psql -U postgres -d rapidfiremultiplier -f 
-- /home/ralphscode/RalphsCode/Springboard/Capstone2/
-- capstone-project-two-1ef1c8247113478187f2e1e8c65becb1/RFM-BackEnd/seed.sql

-- Clear existing data to avoid duplication
TRUNCATE TABLE scores RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Seed data for users table
-- all seed passwords are "pass123"
INSERT INTO users (username, first_name, last_name, email, password_hash, curr_hi_score) VALUES
('Testy', 'Test', 'User', 'testy@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG', 0),
('2Testy', 'Test', 'User2', '2testy@none.com', '$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG', 70);

-- Seed data for scores table
-- q_and_a code: ( Question#, 1stNum, 2ndNum, correct_answer, answer_entered, 1=correct 0=incorrect :)
INSERT INTO scores (user_id, q_and_a, score, curr_hi_score, timestamp, difficulty) VALUES
(1, '1,10,2,20,20,1:2,3,2,6,6,1:', 50, 80, '2025-01-18 10:15:00',1),
(1, '1,10,2,20,20,1:2,3,2,6,6,1:', 60, 80, '2025-01-17 09:30:00',2),
(2, '1,10,2,20,20,1:2,3,2,6,6,1:', 70, 60, '2025-01-18 14:00:00',3);