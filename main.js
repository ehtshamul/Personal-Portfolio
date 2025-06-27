const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET environment variable is required");
    process.exit(1);
}

const admin_route=require('./App/routes/admin/admin');
const project_route=require('./App/routes/admin/projects')
const blog_route=require('./App/routes/admin/blogs');
const contact_router=require('./App/routes/admin/contact')
const roles=require('./App/controller/admin/roles');


const app = express();

// ✅ Middleware
app.use(helmet());
app.use(cors());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);
app.use(express.json());

// ✅ Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Static File Serving
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes home
app.get("/", (req,  res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});

//admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});
/// dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
   
/// error handlie
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
///Register admin router 
app.use('/api/admin',admin_route);
// project route
app.use('/api/projects',project_route);
//blogs router
app.use('/api/blogs', blog_route);
//contact router
app.use('/api/contact',contact_router )





// ✅ MongoDB Connection & Server Start
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DBsurl || "mongodb://127.0.0.1:27017/haq_portfolio"
    );
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();
