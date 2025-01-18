-- Clear existing data to avoid duplication
TRUNCATE TABLE scores RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Seed data for users table
-- all seed passwords are "pass123"
INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES
('john_doe', 'John', 'Doe', 'john.doe@example.com', '$2b$10$e/muqFz8j4O/nThVXwhWdeOYIroJnlHcuywLPBriI3RQFXkU.5FeK'),
('jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', '$2b$10$e/muqFz8j4O/nThVXwhWdeOYIroJnlHcuywLPBriI3RQFXkU.5FeK'),
('sammy01', 'Sammy', 'ONeill', 'sammy01@example.com', '$2b$10$e/muqFz8j4O/nThVXwhWdeOYIroJnlHcuywLPBriI3RQFXkU.5FeK'),
('alice_wonder', 'Alice', 'Wonder', 'alice.w@example.com', '$2b$10$e/muqFz8j4O/nThVXwhWdeOYIroJnlHcuywLPBriI3RQFXkU.5FeK'),
('bob_builder', 'Bob', 'Builder', 'bob.builder@example.com', '$2b$10$e/muqFz8j4O/nThVXwhWdeOYIroJnlHcuywLPBriI3RQFXkU.5FeK');

-- Seed data for scores table
INSERT INTO scores (user_id, episode_data, score, curr_hi_score, timestamp) VALUES
(1, 'Easy: 10 questions', 50, 80, '2025-01-18 10:15:00'),
(1, 'Medium: 20 questions', 60, 150, '2025-01-17 09:30:00'),
(2, 'Hard: 30 questions', 70, 300, '2025-01-18 14:00:00'),
(3, 'Easy: 10 questions', 80, 95, '2025-01-16 12:45:00'),
(4, 'Medium: 20 questions', 90, 175, '2025-01-15 16:10:00'),
(5, 'Hard: 30 questions', 100, 220, '2025-01-18 11:50:00');
