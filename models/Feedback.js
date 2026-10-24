
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        reflection: {
            type: String,
            required: true,
            trim: true
        },

        challenges: {
            type: String,
            default: "",
            trim: true
        },

        learningOutcome: {
            type: String,
            default: "",
            trim: true
        },

        aiFeedback: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
