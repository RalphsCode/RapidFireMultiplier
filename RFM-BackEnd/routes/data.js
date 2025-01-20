"use strict";

const express = require("express");
const db = require("../db");
const router = new express.Router();


/** ======================
 *  POST game results   
 *  =====================
 * 
 * POST /data/username/process route
 * 
 * Example of data passed in API body:
 * note: username is obtained from the params
 * {
	"difficulty": 1,
	"q_and_a" : "1,23,5,25,25,1:2,20,10,200,200,1:",
	"score" : 60, 
	"curr_hi_score" : 80,
  "total_points" : 2080
    } 

* Example output:
    {
	"recordID": {
		"id": 8
	}   }
*/

router.post("/:username/process", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { difficulty, q_and_a, score, curr_hi_score, total_points } = req.body;

    // Validate inputs
    if ( !q_and_a || !score || !curr_hi_score || !total_points ) {
      return res.status(400).json({ error: "ERROR: some game data is missing" });
    }

    // Get user ID
    const userResult = await db.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;

    // Insert game results
    const result = await db.query(  
      `INSERT INTO scores (user_id, difficulty, q_and_a, score, curr_hi_score, total_points)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, difficulty, q_and_a, score, curr_hi_score, total_points]
    );

    const recordID = result.rows[0];
    return res.status(201).json({ recordID });
  } catch (err) {
    return next(err);
  }
});


/** ==================================
 *   GET a user's game results 
 *  ==================================
 * 
 * GET data/username/scores route
 * 
 * Nothing required in the API body.
 * 
 * Example ouput (array of objects):
 * {
	"scores": [
		{   "id": 8,
			"user_id": 1,
			"difficulty": 1,
			"q_and_a": "1,23,5,25,25,1:2,20,10,200,200,1:",
			"score": 60,
			"curr_hi_score": 80,
			"timestamp": "2025-01-19T05:07:29.230Z"
} ]   }
*/
router.get("/:username/scores", async (req, res, next) => {
  try {
    const { username } = req.params;

    // Get user ID
    const userResult = await db.query(
      `SELECT id FROM users WHERE username = $1`,
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user.id;

    // Get game results
    const scores = await db.query(
      `SELECT id, user_id, difficulty, q_and_a, score, curr_hi_score, timestamp
       FROM scores
       WHERE user_id = $1
       ORDER BY timestamp DESC`,
      [userId]
    );

    return res.json({ scores: scores.rows });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
