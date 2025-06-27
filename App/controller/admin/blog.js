const express = require('express');
const Blog = require('../../models/admin/blog');

// Get all blogs
const blog = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Get blog by ID
const blogid = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }
        res.status(500).json({ message: 'Failed to fetch blog' });
    }
};

// Create blog (Admin only)
const createblog = async (req, res) => {
    try {
        const { title, content, excerpt, author, tags, imageUrl, published } = req.body;
        
        // Basic validation
        if (!title || !content || !excerpt) {
            return res.status(400).json({ message: 'Title, content, and excerpt are required' });
        }

        // Handle tags - could be array or string
        let processedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                processedTags = tags;
            } else if (typeof tags === 'string') {
                processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }

        const newBlog = new Blog({
            title,
            content,
            excerpt,
            author: author || 'Admin',
            tags: processedTags,
            imageUrl,
            published: published !== undefined ? published : true
        });
        
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Error creating blog:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to create blog' });
    }
};

// Update blog (Admin only)
const updateblog = async (req, res) => {
    try {
        const { title, content, excerpt, author, tags, imageUrl, published } = req.body;
        
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (excerpt) updateData.excerpt = excerpt;
        if (author) updateData.author = author;
        
        // Handle tags - could be array or string
        if (tags) {
            if (Array.isArray(tags)) {
                updateData.tags = tags;
            } else if (typeof tags === 'string') {
                updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
        }
        
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (published !== undefined) updateData.published = published;

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to update blog' });
    }
};

// Delete blog (Admin only)
const deleteblog = async (req, res) => {
    try {
        const deleted = await Blog.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid blog ID' });
        }
        res.status(500).json({ message: 'Failed to delete blog' });
    }
};

module.exports = { blog, blogid, createblog, updateblog, deleteblog };
