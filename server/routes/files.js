const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task"); 

const taskValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .escape(),
];


router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", auth, taskValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, fileName, fileOriginalName, filePath } = req.body;
    const newTask = new Task({
      title,
      fileName,
      fileOriginalName,
      filePath,
      user: req.user.id,
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", auth, taskValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, fileName, fileOriginalName, filePath } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, fileName, fileOriginalName, filePath },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
