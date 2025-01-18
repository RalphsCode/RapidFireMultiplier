const express = require("express");
const router = new express.Router();

/** Login route */
router.post("/login", (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Add login logic here (e.g., check username/password in the database)
    if (username === "john_doe" && password === "pass123") {
      return res.json({ message: `Login successful, welcome ${username}`, token: "123abc" });
    }

    return res.status(400).json({ error: "ERROR: Invalid username or password" });
  } catch (err) {
    return next(err);
  }
});

/** Register New User route */
router.post("/register", (req, res, next) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    // Add registration logic here (e.g., save the user to the database)
    return res.status(201).json({ message: `${username} registered successfully` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
