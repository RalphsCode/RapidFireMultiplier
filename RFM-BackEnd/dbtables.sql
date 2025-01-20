-- The tables to go in the rapidfiremultiplier database.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    curr_hi_score INT,
    total_points INT
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    difficulty TEXT NOT NULL,
    score INT NOT NULL,
    curr_hi_score INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    q_and_a TEXT NOT NULL   
);

