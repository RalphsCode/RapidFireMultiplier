# Backend for the Rapid Fire Multiplication Game

To run:
    npx nodemon

Runs on Localhost port 3001.
Connects to 'rapidfiremultiplier' database.

# There are 3 Route Directories:
data - which post and retrieve a user's game details/scores
users - which returns the users details, and can update their details
auth - which allows users to register and login.

# End Points
    DATA
POST  /data/username/process  - Update database with completed game data
GET   /data/username/scores  - Retrieve a users score data
    USERS
GET   /users/username   - Retrieve info about a user
PATCH /users/username   - Update a users details
    AUTH
POST  /auth/login   - Login an existing user
POST /auth/register - Register a new user


