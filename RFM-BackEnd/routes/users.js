const express = require("express");
const router = new express.Router();

/** Users route */
router.get("/users", (req, res, next) => {
        return res.json({ message: `Login successful, welcome ${username}`, token: "123abc" });
      }
    )

module.exports = router;