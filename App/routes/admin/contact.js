const express = require('express');
const routers = express.Router();
const { contact, contactm, adminemail, deleteContact, replyContact, getContactById } = require('../../controller/admin/contact');
const middleware = require('../../middleware/usermiddle');

// 🔹 Public Contact Routes
routers.get('/mails', contactm);                      // Get all contact messages
routers.post('/mail', contact);                       // Submit contact form
routers.get('/mail/:id', getContactById);             // Get single contact message

// 🔹 Admin-only Contact Routes
routers.post('/adminmail', middleware, adminemail);   // Send admin email
routers.delete('/delete/:id', middleware, deleteContact); // Delete contact message
routers.post('/reply-to/:id', middleware, replyContact);  // Reply to contact message

module.exports = routers;