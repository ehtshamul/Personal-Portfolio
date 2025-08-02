require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Check for required env vars
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET environment variable is required");
    process.exit(1);
}

const admin_route = require('./App/routes/admin/admin');
const project_route = require('./App/routes/admin/projects');
const blog_route = require('./App/routes/admin/blogs');
const contact_router = require('./App/routes/admin/contact');

const app = express();

app.use(helmet());
app.use(cors());

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/api/test", (req, res) => res.json({ message: "Server is working!", timestamp: new Date().toISOString() }));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));

// API routes
app.use('/api/admin', admin_route);
app.use('/api/projects', project_route);
app.use('/api/blogs', blog_route);
app.use('/api/contact', contact_router);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB and server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/haq_portfolio");
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};



connectDB();
