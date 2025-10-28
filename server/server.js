require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const filesRouter = require("./routes/files");
const path = require("path");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");




app.use(cors());
app.use(express.json());
app.use("/api/files", filesRouter);



app.use("/uploads", express.static(path.join(__dirname, "uploads")));



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});




app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.post("/api/auth/signup", (req, res) => {
  res.json({ message: "Signup route works", data: req.body });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
