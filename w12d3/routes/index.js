const express = require("express");
const { asyncHandler } = require('../utils');
const router = express.Router()


router.get("/", (req, res) => {
  res.json({message: "test root index"});
});

module.exports = router;