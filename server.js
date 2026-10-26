require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://amazing-belekoy-7feedf.netlify.app"
  ],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message : "Pair Programming Tracker API is running"
    })
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message : err.message || "Internal server error"
    })
})

const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`)
    })
})
.catch((error) => {
    console.error("Could not connect to MongoDB: ", error.message);
    process.exit(1);
})