const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const protect = require("../middleware/auth");

const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

router.use(protect);

router.route("/")
    .post(createStudent)
    .get(getStudents);

router.route("/:id")
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;