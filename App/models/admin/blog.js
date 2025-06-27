const mongoose = require('mongoose');

// Create Blog Schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,        
      required: true,      
      trim: true,
    },
    content: {             
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/600x300',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,     // ✅ should be here as second argument
  }
);

// Export the model
module.exports = mongoose.model('Blog', blogSchema);
