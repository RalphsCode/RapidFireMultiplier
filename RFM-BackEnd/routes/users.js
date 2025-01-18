const express = require("express");
const router = new express.Router();

/** Users route */
router.get("/", (req, res, next) => {
        return res.json({ message: "List of all users here..." });
      }
    )

module.exports = router;