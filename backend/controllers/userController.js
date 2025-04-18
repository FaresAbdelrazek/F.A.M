
const User       = require('../models/User');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host:    process.env.EMAIL_HOST,                // smtp.office365.com
    port:    parseInt(process.env.EMAIL_PORT, 10),  // 587
    secure:  false,                                 // use STARTTLS
    requireTLS: true,                               // enforce STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // disable certificate validation if your org uses a self‑signed cert
      rejectUnauthorized: false
    }
  });
  


function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}


exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    res.status(201).json({ token: signToken(user) });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    res.json({ token: signToken(user) });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.getProfile = (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.profilePicture) updates.profilePicture = req.body.profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('No account with that email');
      error.statusCode = 404;
      return next(error);
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15m
    await user.save();

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your password reset code',
      text: `Your OTP code is ${otp}. It expires in 15 minutes.`,
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      const error = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      return next(error);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password has been reset' });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};