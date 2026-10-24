const Student = require("../models/Student");

const createStudent = async (req, res) => {
    try {
        const { name, studentId, email, skills } = req.body;

        if (!name || !studentId || !email) {
            return res.status(400).json({
                message: "Name, student ID, and email are required"
            });
        }

        const existingStudent = await Student.findOne({
            studentId: studentId.trim()
        });

        if (existingStudent) {
            return res.status(409).json({
                message: "Student ID already exists"
            });
        }

        const student = await Student.create({
            name,
            studentId: studentId.trim(),
            email,
            skills: Array.isArray(skills) ? skills : []
        });

        res.status(201).json({
            message: "Student created successfully",
            student
        });
    } catch (error) {
        console.error("Create student error:", error.message);

        res.status(500).json({
            message: "Unable to create student"
        });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("assignedMentor", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: students.length,
            students
        });
    } catch (error) {
        console.error("Get students error:", error.message);

        res.status(500).json({
            message: "Unable to fetch students"
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        console.error("Update student error:", error.message);

        res.status(400).json({
            message: "Unable to update student. Check the provided data."
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error("Delete student error:", error.message);

        res.status(400).json({
            message: "Unable to delete student. Check the student ID."
        });
    }
};

module.exports = {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent
};