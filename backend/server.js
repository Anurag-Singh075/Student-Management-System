
const express = require("express");
const cors = require("cors");
require("dotenv").config({
    path: require("path").join(__dirname, ".env")
});

const db = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
    res.send("Student Management Backend Running");
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");
        res.json({
            message: "MySQL Connected Successfully",
            data: rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log("Backend running on port 5000");
});
