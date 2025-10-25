
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
require('dotenv').config();

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

module.exports = router;
