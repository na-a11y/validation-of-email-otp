// Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file
const cors = require('cors');
// Create an Express.js app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5500']
}));
// Nodemailer configuration


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true // Enable debugging output for SMTP
});

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP (for demonstration, generate a random 6-digit OTP)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Configure email sending options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Verification',
      text: Your OTP (One Time Password) is: ${otp}
    };

    // Send email using Nodemailer
    const info = await transporter.sendMail(mailOptions);

    // Debug output for email sending information
    console.log('Email sent:', info);

    // Respond with success message
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(Server is running on http://localhost:${port});
});