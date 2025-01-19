"use strict";

/** Express app for RFM. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const app = express();

app.use(cors());
app.use(express.json());


/** routes */
const dataRoutes = require("./routes/data");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

app.use("/data", dataRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


// Need the following for render.com
app.get('/', (req, res) => {
    res.send('Welcome to the Rapid Fire Multiplier Backend!');
  });
  
app.get('/favicon.ico', (req, res) => {
  res.status(204).send(); // No Content
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
  
    return res.status(status).json({
      error: { message, status },
    });
});

const PORT = process.env.PORT || 3001;  // Use a port from the environment or default to 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
