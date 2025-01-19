# Backend for the Rapid Fire Multiplication Game

To run: \n
    npx nodemon \n\n

Runs on Localhost port 3001.\n
Connects to 'rapidfiremultiplier' database.

# There are 3 Route Directories:
data - which post and retrieve a user's game details/scores \n
users - which returns the users details, and can update their details \n
auth - which allows users to register and login. \n

# End Points
    DATA \n
POST  /data/username/process  - Update database with completed game data \n
GET   /data/username/scores  - Retrieve a users score data \n
    USERS \n
GET   /users/username   - Retrieve info about a user \n
PATCH /users/username   - Update a users details \n
    AUTH \n
POST  /auth/login   - Login an existing user \n
POST /auth/register - Register a new user \n


