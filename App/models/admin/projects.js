const mongoose = require('mongoose');

// Create Project Schema
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,           // ❌ was `string` (should be capitalized: `String`)
      required: true,         // ❌ was `require` (should be `required`)
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: String,
      required: true,
    },
    githuburl: {
      type: String,
      trim: true,
      required: false,
    }, 
    liveurl: {
      type: String,
      trim: true,
      required: false,
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/400x250',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,      
  }
);

// Export the model
module.exports = mongoose.model('Project', projectSchema);  
