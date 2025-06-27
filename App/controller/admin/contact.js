const express = require('express');
const Contact = require('../../models/admin/contact');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create Gmail transporter
const createTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
};

// ✅ Handle contact form submission (POST)
const contact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, email, subject, and message are required' 
      });
    }

    // Save contact message to DB
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Try to send notification email (optional)
    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
        const transporter = createTransport();
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        };

        await transporter.sendMail(mailOptions);
        
        // Send auto-reply to user
        const userReplyOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: 'Thank you for contacting us!',
          html: `
            <p>Dear ${name},</p>
            <p>Thank you for reaching out! I've received your message and will get back to you shortly.</p>
            <hr>
            <p><strong>Your Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <br>
            <p>Best regards,<br>Ehtsham (Portfolio Admin)</p>
          `,
        };

        await transporter.sendMail(userReplyOptions);
        console.log('✅ Auto-reply sent to user');
        console.log('✅ Email sent successfully');
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Don't fail the request if email fails
    }

    return res.status(201).json({ 
      message: 'Message submitted successfully!' 
    });

  } catch (error) {
    console.error('Contact controller error:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// ✅ Get single contact message by ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }
    res.status(500).json({ message: 'Failed to fetch contact message' });
  }
};

// ✅ Admin: Update message status (e.g. "read", "replied")
const adminemail = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Admin email error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all contact messages
const contactm = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 }); // Latest first
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Failed to fetch contacts' });
    }
};

// ✅ Delete contact message (Admin only)
const deleteContact = async (req, res) => {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.json({ message: 'Contact message deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }
        res.status(500).json({ message: 'Failed to delete contact message' });
    }
};

// ✅ Reply to contact message (Admin only)
const replyContact = async (req, res) => {
    try {
        console.log('Reply contact request received:', req.params.id);
        console.log('Request body:', req.body);
        
        const { to, subject, message } = req.body;
        
        // Validate required fields
        if (!to || !subject || !message) {
            console.log('Missing required fields:', { to, subject, message });
            return res.status(400).json({ 
                message: 'To, subject, and message are required' 
            });
        }

        // Get the original contact message
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            console.log('Contact not found with ID:', req.params.id);
            return res.status(404).json({ message: 'Contact message not found' });
        }

        console.log('Found contact:', contact);

        // Send reply email
        try {
            if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
                console.log('Email credentials found, sending email...');
                const transporter = createTransport();
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: to,
                    subject: subject,
                    html: `
                        <p>${message.replace(/\n/g, '<br>')}</p>
                        <hr>
                        <p><em>This is a reply to your message: "${contact.subject}"</em></p>
                        <br>
                        <p>Best regards,<br>Ehtsham (Portfolio Admin)</p>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log('✅ Reply email sent successfully');
            } else {
                console.log('⚠️ Email credentials not configured, skipping email send');
                console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'Set' : 'Not set');
                console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'Set' : 'Not set');
            }
        } catch (emailError) {
            console.error('❌ Email sending failed:', emailError.message);
            // Don't fail the request if email fails, just log it
            console.log('Continuing with status update despite email failure');
        }

        // Update contact status to "replied"
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: 'replied' },
            { new: true, runValidators: true }
        );

        console.log('Contact status updated:', updatedContact);

        res.json({ message: 'Reply sent successfully' });
    } catch (error) {
        console.error('Error replying to contact:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid contact ID' });
        }
        res.status(500).json({ message: 'Failed to send reply: ' + error.message });
    }
};

module.exports = { contact, adminemail, contactm, deleteContact, replyContact, getContactById };
