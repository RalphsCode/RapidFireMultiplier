"use strict";

const express = require("express");
const router = new express.Router(); // Create a router instance

// POST /login route
router.post("/login", (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Mock login logic
    if (username === "john_doe" && password === "pass123") {
      return res.json({ message: `Login successful, welcome ${username}`, token: "123abc" });
    }

    // Invalid credentials
    return res.status(400).json({ error: "Invalid username or password." });
  } catch (err) {
    return next(err); // Pass errors to the generic error handler
  }
});

module.exports = router; // Export the router to use in the main app
