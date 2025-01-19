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
 * Returns: username, first_name, last_name, email, curr_hi_score
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

module.exports = router;
