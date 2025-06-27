const express = require('express');
const routers = express.Router();
const { blog, blogid, createblog, updateblog, deleteblog } = require('../../controller/admin/blog'); // blog
const middleware = require('../../middleware/usermiddle');

// 🔹 Public Blog Routes
routers.get('/blog', blog);                           // Get all blogs
routers.get('/blog/:id', blogid);                     // Get single blog by ID

// 🔹 Admin-only Blog Routes
routers.post('/create', middleware, createblog);      // Create new blog
routers.put('/update/:id', middleware, updateblog);   // Update blog
routers.delete('/delete/:id', middleware, deleteblog); // Delete blog

module.exports = routers;