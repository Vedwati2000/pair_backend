const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");

const {
    createSession,
    getSessions,
    getSessionById,
    updateSession,
    deleteSession
} = require("../controllers/sessionController");

router.use(protect);

router.route("/")
    .post(createSession)
    .get(getSessions);

router.route("/:id")
    .get(getSessionById)
    .put(updateSession)
    .delete(deleteSession);

module.exports = router;