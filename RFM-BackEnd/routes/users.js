"use strict";

const express = require("express");
const db = require("../db");
const router = new express.Router();

/** ==========================
 *   GET a user's details 
 *  ==========================
 * 
 * GET /users/username/ route
 * 
 * Nothing is required in the API body
 * 
 * Example output:
 * {  	"user": {
		"username": "Testy",
		"first_name": "Mr Test",
		"last_name": "Userrr",
		"email": "newemail@none.com",
		"curr_hi_score": 100
	}  }
*/
router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;

    const result = await db.query(
      `SELECT username, first_name, last_name, email, curr_hi_score
       FROM users
       WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user details
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});



/** ==========================
 *   Update a user's details 
 *  ==========================
 * 
 * PATCH /users/:username/
 * 
 * Allows updating the user's first_name, last_name, email, curr_hi_score, total_points.
 * One, some, or all, of those fields may be passed in the API body.
 * 
 * Request Body (JSON):
 * 
 * { "curr_hi_score": 180,
     "total_points": 1200 }
 * 
 * OR
 * 
  {   "first_name": "Mr Test",
  "last_name": "Userrr",
  "email": "newemail@none.com",
  "curr_hi_score": 10
    }
 * 
 * Example output: 
 * {
	"user": {
		"id": 12
	}
}
 */
router.patch("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { first_name, last_name, email, curr_hi_score, total_points } = req.body;

    // Update fields dynamically
    const fields = [];
    const values = [];
    let idx = 1;

    if (first_name !== undefined) {
      fields.push(`first_name = $${idx++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push(`last_name = $${idx++}`);
      values.push(last_name);
    }
    if (email !== undefined) {
      fields.push(`email = $${idx++}`);
      values.push(email);
    }
    if (curr_hi_score !== undefined) {
      fields.push(`curr_hi_score = $${idx++}`);
      values.push(curr_hi_score);
    }
    if (total_points !== undefined) {
      fields.push(`total_points = $${idx++}`);
      values.push(total_points);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No data provided to update" });
    }

    // Add username to the values array for the WHERE clause
    values.push(username); 

    const result = await db.query(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE username = $${idx}
       RETURNING id`,
      values
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
