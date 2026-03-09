const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/email');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/*
================================
REGISTER
================================
*/
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          error: 'Email already registered'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false
      });

      await user.save();

      /*
      ================================
      SEND OTP EMAIL
      ================================
      */
      const emailResult = await sendOTPEmail(email, otp);

      // If email service unavailable OR failed → show development OTP
      if (emailResult.mockOTP || emailResult.success === false) {
        return res.status(201).json({
          message: 'User registered. Email could not be sent, using development OTP.',
          userId: user._id,
          developmentOTP: otp
        });
      }

      return res.status(201).json({
        message: 'User registered. Please check your email for verification code.',
        userId: user._id
      });

    } catch (error) {
      console.error('Registration error:', error);

      res.status(500).json({
        error: 'Registration failed'
      });
    }
  }
);

/*
================================
VERIFY OTP
================================
*/
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: 'User already verified'
      });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({
        error: 'OTP expired. Please request a new one.'
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        error: 'Invalid OTP'
      });
    }

    // Mark verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);

    res.status(500).json({
      error: 'Verification failed'
    });
  }
});

/*
================================
RESEND OTP
================================
*/
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: 'User already verified'
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    const emailResult = await sendOTPEmail(user.email, otp);

    if (emailResult.mockOTP || emailResult.success === false) {
      return res.json({
        message: 'OTP resent (development mode)',
        developmentOTP: otp
      });
    }

    res.json({
      message: 'OTP resent to your email'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);

    res.status(500).json({
      error: 'Failed to resend OTP'
    });
  }
});

/*
================================
LOGIN
================================
*/
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          error: 'Email not verified. Please verify your email first.',
          userId: user._id
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email
        }
      });

    } catch (error) {
      console.error('Login error:', error);

      res.status(500).json({
        error: 'Login failed'
      });
    }
  }
);

module.exports = router;