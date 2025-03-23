const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    preferredLanguage: { type: String, required: true },
    skills: { type: String, required: true },
    reg_no: { type: String, required: true },
    batch: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Email Transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send email
async function sendEmail(email, name) {
    try {
        const info = await transporter.sendMail({
            from: '"Code Crafters Programming Club" <dev.ccpc@gmail.com>',
            to: email,
            subject: "Next Steps for Your Code Crafters Programming Club Registration",
            text: `Dear ${name},\n\nThank you for registering for the Code Crafters Programming Club! ...`, // Keep the full email here
        });
        console.log("Email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Email Error:", error);
        return false;
    }
}

// User Registration Route
app.post('/login', async (req, res) => {
    try {
        const { email, name, phone, department, PreferedLanguage, Skills, reg_no, Batch } = req.body;


        if (!email || !password || !name || !phone || !preferredLanguage || !skills || !reg_no || !batch) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ ok: true, message: 'User already exists' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, phone, preferredLanguage, skills, reg_no, batch });
        await newUser.save();

        // Send email
        const emailSent = await sendEmail(email, name);
        if (!emailSent) {
            return res.status(500).json({ error: 'User registered but email failed to send. Contact dev.ccpc@gmail.com' });
        }

        res.redirect('https://ccpc-cuj.web.app/');
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Something went wrong, please try again!' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
