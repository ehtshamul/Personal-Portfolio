const express = require('express');
const routers = express.Router();
const { project, featured, Idproj, createadmin, Update, delect } = require('../../controller/admin/projects');//project
const middleware = require('../../middleware/usermiddle');

// 🔹 Public Project Routes
routers.get('/project', project);                     // Get all projects
routers.get('/feature', featured);                    // Get featured projects
routers.get('/projects/:id', Idproj);                 // Get single project by ID

// 🔹 Admin-only Project Routes
routers.post('/create', middleware, createadmin);     // Create new project
routers.put('/update/:id', middleware, Update);       // Update project
routers.delete('/delete/:id', middleware, delect);    // Delete project

module.exports = routers;