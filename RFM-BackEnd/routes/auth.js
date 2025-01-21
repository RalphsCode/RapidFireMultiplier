"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db"); // Import database connection
const router = new express.Router();

/** =========================
 *   Existing user LOGIN
 *  =========================
 * 
 * POST /auth/login route
 * 
 * The username and password are passed in the body as JSON.
 * 
 * Return Example:
 * { 	"username": "Testy",
		"first_name": "Testy",
		"last_name": "One",
		"email": "newemail@none.com",
		"curr_hi_score": 100,
    "total_points": 1800
    }  }

} */ 
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Query the database for the user
    const result = await db.query(
      `SELECT username, first_name, last_name, email, curr_hi_score, total_points, password_hash
       FROM users 
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid Username or password." });
    }

    // Compare provided password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid username or Password." });
    }

    const outObj = {username: user.username, 
                    first_name: user.first_name, 
                    last_name: user.last_name, 
                    email: user.email,
                    curr_hi_score: user.curr_hi_score,
                    total_points: user.total_points};

      // Respond with the user data
      return res.status(200).json({ user : outObj  });
  } catch (err) {
    return next(err);
  }
});



/** ================================ 
 *   Register a NEW USER.
 *  ================================
 * 
 * POST /auth/register route
 * 
 * Example of data passed in the API body:
 *  - All fields are required.
 * 
 *  {	"username" : "Testy" ,
	"password" : "pass123",
	"first_name" : "Test", 
	"last_name" : "User",
	"email" : "testy@none.com"	
    } 
    
    Return Example:
        {  "user": {
		"username": "Test1",
		"first_name": "Test",
		"last_name": "User",
		"email": "testy1@none.com",
		"curr_hi_score": 0
	}  }
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
         (username, first_name, last_name, email, password_hash, curr_hi_score) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING username, first_name, last_name, email, curr_hi_score`,
        [username, first_name, last_name, email, passwordHash, 0]
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
