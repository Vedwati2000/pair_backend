const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        navigator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        problemTitle: {
            type: String,
            required: true,
            trim: true
        },
        topic: {
            type: String,
            trim: true,
            default: ""
        },
        duration: {
            type: Number,
            required: true,
            min: 1
        },
        status: {
            type: String,
            enum: ["planned", "in-progress", "completed"],
            default: "completed"
        },
        notes: {
            type: String,
            default: ""
        },
        learningOutcome: {
            type: String,
            default: ""
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Session", sessionSchema);