
const Feedback = require("../models/Feedback");
const Session = require("../models/Session");
const Student = require("../models/Student");
const { generateAIResponse } = require("../services/groqService");

const createFeedback = async (req, res) => {
    try {
        const {
            sessionId,
            studentId,
            reflection,
            challenges,
            learningOutcome
        } = req.body;

        if (!sessionId || !studentId || !reflection) {
            return res.status(400).json({
                success: false,
                message: "Session, student, and reflection are required."
            });
        }

        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found."
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const belongsToSession =
            session.driver.toString() === studentId ||
            session.navigator.toString() === studentId;

        if (!belongsToSession) {
            return res.status(403).json({
                success: false,
                message: "The student does not belong to this session."
            });
        }

        const prompt = `
Analyze this pair programming reflection.

Session topic: ${session.topic}
Problem: ${session.problemTitle}

Student reflection:
${reflection}

Challenges:
${challenges || "Not provided"}

Learning outcome:
${learningOutcome || "Not provided"}

Give constructive, encouraging feedback about collaboration,
communication, problem-solving, and learning.

Mention only observations supported by the information provided.
Suggest two practical improvements.
Keep the response student-friendly and concise.
`;

        const aiFeedback = await generateAIResponse(prompt);

        const feedback = await Feedback.create({
            session: sessionId,
            student: studentId,
            reflection,
            challenges: challenges || "",
            learningOutcome: learningOutcome || "",
            aiFeedback
        });

        return res.status(201).json({
            success: true,
            message: "AI feedback generated successfully.",
            feedback
        });
    } catch (error) {
        console.error("Feedback error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to generate feedback right now."
        });
    }
};

module.exports = { createFeedback };
