const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all students
router.get("/", async (req, res) => {
    try {
        const [students] = await db.query(
            "SELECT * FROM students ORDER BY id DESC"
        );
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add student
router.post("/", async (req, res) => {
    try {
        const { name, email, course } = req.body;

        const [result] = await db.query(
            "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
            [name, email, course]
        );

        res.status(201).json({
            message: "Student added successfully",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update student
router.put("/:id", async (req, res) => {
    try {
        const { name, email, course } = req.body;
        const { id } = req.params;

        const [result] = await db.query(
            "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?",
            [name, email, course, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete student
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM students WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;