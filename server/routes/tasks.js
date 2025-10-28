
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", auth, async (req, res) => {
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
    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const { title, fileName, fileOriginalName, filePath } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, fileName, fileOriginalName, filePath },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

