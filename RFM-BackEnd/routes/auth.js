"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db"); // Import database connection
const router = new express.Router();

/** Existing user LOGIN
 * 
 * POST /login route
 * 
 * Return Example:
 * { "user": {
		"username": "Testy",
		"first_name": "Test",
		"last_name": "User",
		"password_hash": "$2b$10$RMHXIP8riKgT4z6n4nyOwugNPdISoZQNwZDqPUgbjpyt1z.5QTcQG"
	}

} */ 
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Query the database for the user
    const result = await db.query(
      `SELECT username, first_name, last_name, password_hash 
       FROM users 
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    console.log("user from db:", user);

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    // Compare provided password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

      // Respond with the user data
      return res.status(200).json({ user: user  });
  } catch (err) {
    return next(err);
  }
});



/** Route to Register a NEW USER.
 * 
 * POST /register route
 * 
 * Example API body:
 *  {
	"username" : "Testy" ,
	"password" : "pass123",
	"first_name" : "Test", 
	"last_name" : "User",
	"email" : "testy@none.com"	
    } 
    All fields are required.
    
    Return Example:
        { "user": {
		"username": "2Testy",
		"first_name": "Test",
		"last_name": "User" }
}
    */

router.post("/register", async (req, res, next) => {
    try {
      const { username, first_name, last_name, email, password } = req.body;
  
      // Validate input
      if (!username || !first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Check if username or email already exists
      const duplicateCheck = await db.query(
        `SELECT id 
         FROM users 
         WHERE username = $1 OR email = $2`,
        [username, email]
      );
  
      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ error: "ERROR: Username or email already exists." });
      }
  
      // Hash the password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      // Insert the new user into the database
      const result = await db.query(
        `INSERT INTO users 
         (username, first_name, last_name, email, password_hash) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING username, first_name, last_name`,
        [username, first_name, last_name, email, passwordHash]
      );
      
      // Returns (1)username, (2)first_name, (3)last_name
      const newUser = result.rows[0];
  
      // Respond with the new user data
      return res.status(201).json({
        user: newUser,
      });
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;
