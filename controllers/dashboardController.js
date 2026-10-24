const Student = require("../models/Student");
const Session = require("../models/Session");

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalStudents,
            totalSessions,
            completedSessions,
            totalMinutes,
            recentSessions,
            dailyActivity,
            topicActivity
        ] = await Promise.all([
            Student.countDocuments({ isActive: true }),

            Session.countDocuments(),

            Session.countDocuments({ status: "completed" }),

            Session.aggregate([
                {
                    $match: {
                        status: "completed"
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$duration" }
                    }
                }
            ]),

            Session.find()
                .populate("driver", "name studentId")
                .populate("navigator", "name studentId")
                .sort({ createdAt: -1 })
                .limit(5),

            Session.aggregate([
                {
                    $match: {
                        status: "completed",
                        createdAt: {
                            $gte: new Date(
                                new Date().setDate(new Date().getDate() - 6)
                            )
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        },
                        sessions: { $sum: 1 },
                        minutes: { $sum: "$duration" }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]),

            Session.aggregate([
                {
                    $match: {
                        status: "completed",
                        topic: {
                            $nin: ["", null]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$topic",
                        sessions: { $sum: 1 },
                        minutes: { $sum: "$duration" }
                    }
                },
                {
                    $sort: {
                        sessions: -1
                    }
                },
                {
                    $limit: 5
                }
            ])
        ]);

        const activityMap = new Map(
            dailyActivity.map((item) => [item._id, item])
        );

        const lastSevenDays = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const dateKey = [
                date.getFullYear(),
                String(date.getMonth() + 1).padStart(2, "0"),
                String(date.getDate()).padStart(2, "0")
            ].join("-");

            const activity = activityMap.get(dateKey);

            lastSevenDays.push({
                date: dateKey,
                sessions: activity ? activity.sessions : 0,
                minutes: activity ? activity.minutes : 0
            });
        }

        res.status(200).json({
            stats: {
                totalStudents,
                totalSessions,
                completedSessions,
                totalMinutes: totalMinutes[0]?.total || 0
            },
            recentSessions,
            dailyActivity: lastSevenDays,
            topicActivity
        });
    } catch (error) {
        console.error("Dashboard statistics error:", error.message);

        res.status(500).json({
            message: "Unable to fetch dashboard statistics"
        });
    }
};

module.exports = {
    getDashboardStats
};