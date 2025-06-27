const express = require('express');
const jwt = require('jsonwebtoken');
const Project = require('../../models/admin/projects');

// Get all projects
const project = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Failed to fetch projects' });
    }
};

// Get featured projects
const featured = async (req, res) => {
    try {
        const featureds = await Project.find({ featured: true }).sort({ createdAt: -1 });
        res.json(featureds);
    } catch (error) {
        console.error('Error fetching featured projects:', error);
        res.status(500).json({ message: 'Failed to fetch featured projects' });
    }
};

// Get project by ID
const Idproj = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: 'Failed to fetch project' });
    }
};

// Create project (Admin only)
const createadmin = async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, liveUrl, imageUrl, featured } = req.body;
        
        // Basic validation
        if (!title || !description || !technologies) {
            return res.status(400).json({ message: 'Title, description, and technologies are required' });
        }

        // Handle both camelCase and lowercase field names
        const projectData = {
            title,
            description,
            technologies,
            githuburl: githubUrl || req.body.githuburl || '', // Accept both formats, default to empty string
            liveurl: liveUrl || req.body.liveurl || '', // Accept both formats, default to empty string
            imageUrl: imageUrl || req.body.imageUrl,
            featured: featured || false
        };

        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to create project' });
    }
};

// Update project (Admin only)
const Update = async (req, res) => {
    try {
        const { title, description, technologies, githubUrl, liveUrl, imageUrl, featured } = req.body;
        
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (technologies) updateData.technologies = technologies;
        if (githubUrl) updateData.githuburl = githubUrl;
        if (liveUrl) updateData.liveurl = liveUrl;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (featured !== undefined) updateData.featured = featured;

        // Handle both camelCase and lowercase field names
        if (req.body.githuburl && !githubUrl) updateData.githuburl = req.body.githuburl;
        if (req.body.liveurl && !liveUrl) updateData.liveurl = req.body.liveurl;

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to update project' });
    }
};

// Delete project (Admin only)
const delect = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: 'Failed to delete project' });
    }
};

module.exports = { project, featured, Idproj, createadmin, Update, delect };
