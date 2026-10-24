
const express = require("express");
const router = express.Router();

const { createFeedback } = require("../controllers/feedbackController");
const auth = require("../middleware/auth");

router.post("/analyze", auth, createFeedback);

module.exports = router;
