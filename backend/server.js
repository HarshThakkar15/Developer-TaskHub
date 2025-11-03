const path = require("path");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "/frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});