const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Adjust to your frontend's address
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
      res.sendStatus(200); // Handle preflight request
  } else {
      next();
  }
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debugging output for SMTP
    logger: true  // Log SMTP traffic
});

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Verification',
            text: `Your OTP (One Time Password) is: ${otp}`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
