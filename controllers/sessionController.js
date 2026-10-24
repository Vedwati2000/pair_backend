const Session = require("../models/Session");
const Student = require("../models/Student");
const mongoose = require("mongoose");

const createSession = async (req, res) => {
    try {
        const {
            driver,
            navigator,
            problemTitle,
            topic,
            duration,
            status,
            notes,
            learningOutcome
        } = req.body;

        if (!driver || !navigator || !problemTitle || duration == null) {
            return res.status(400).json({
                message: "Driver, Navigator, problem title, and duration are required"
            });
        }

        if (!mongoose.isValidObjectId(driver) ||
            !mongoose.isValidObjectId(navigator)) {
            return res.status(400).json({
                message: "Invalid Driver or Navigator ID"
            });
        }

        if (driver === navigator) {
            return res.status(400).json({
                message: "Driver and Navigator must be different students"
            });
        }

        if (!Number.isFinite(Number(duration)) || Number(duration) < 1) {
            return res.status(400).json({
                message: "Duration must be at least 1 minute"
            });
        }

        if (status && !["planned", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid session status"
            });
        }

        const students = await Student.find({
            _id: { $in: [driver, navigator] }
        });

        if (students.length !== 2) {
            return res.status(404).json({
                message: "Driver or Navigator student not found"
            });
        }

        const session = await Session.create({
            driver,
            navigator,
            problemTitle,
            topic,
            duration: Number(duration),
            status,
            notes,
            learningOutcome,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Pair programming session created successfully",
            session
        });
    } catch (error) {
        console.error("Create session error:", error.message);

        res.status(500).json({
            message: "Unable to create session"
        });
    }
};

const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate("driver", "name studentId email")
            .populate("navigator", "name studentId email")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: sessions.length,
            sessions
        });
    } catch (error) {
        console.error("Get sessions error:", error.message);

        res.status(500).json({
            message: "Unable to fetch sessions"
        });
    }
};

const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const session = await Session.findById(id)
            .populate("driver", "name studentId email")
            .populate("navigator", "name studentId email")
            .populate("createdBy", "name email");

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({ session });
    } catch (error) {
        console.error("Get session error:", error.message);

        res.status(500).json({
            message: "Unable to fetch session"
        });
    }
};

const updateSession = async (req, res) => {
    try {
        const allowedFields = [
            "problemTitle",
            "topic",
            "duration",
            "status",
            "notes",
            "learningOutcome"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "Provide at least one valid field to update"
            });
        }

        if (updates.duration !== undefined) {
            if (!Number.isFinite(Number(updates.duration)) ||
                Number(updates.duration) < 1) {
                return res.status(400).json({
                    message: "Duration must be at least 1 minute"
                });
            }

            updates.duration = Number(updates.duration);
        }

        if (updates.status !== undefined &&
            !["planned", "in-progress", "completed"].includes(updates.status)) {
            return res.status(400).json({
                message: "Invalid session status"
            });
        }

        const session = await Session.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({
            message: "Session updated successfully",
            session
        });
    } catch (error) {
        console.error("Update session error:", error.message);

        res.status(400).json({
            message: "Unable to update session"
        });
    }
};

const deleteSession = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid session ID"
            });
        }

        const session = await Session.findByIdAndDelete(req.params.id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        res.status(200).json({
            message: "Session deleted successfully"
        });
    } catch (error) {
        console.error("Delete session error:", error.message);

        res.status(500).json({
            message: "Unable to delete session"
        });
    }
};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    updateSession,
    deleteSession
};