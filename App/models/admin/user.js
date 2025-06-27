const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { compare } = require('bcryptjs');

// Create Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,     
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,     
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,     
      minlength: 8,       
      trim: true,
    },
    role: {
      type: String,
      default: "admin",   
    },
  },
  {
    timestamps: true      
  });


userSchema.pre('save', async function(next){
    if(!this.isModified('password'))   return next();
    this.password= await bcrypt.hash(this.password ,12);
    next();
} );
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};



// Export the model
module.exports = mongoose.model('User', userSchema);
