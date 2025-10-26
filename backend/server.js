
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) { // Check if not already connected
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }
};

// Middleware to connect to DB on each request (Vercel serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/categories', require('./routes/categories'));
app.get('/', (req, res) => {
  res.send('<h1>Jewellery Store API</h1>');
});

// Commenting out createAdmin for Vercel deployment
/*
const createAdmin = async () => {
  try {
    console.log('Checking for admin user...');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.log('Admin credentials not found in .env file. Skipping admin creation.');
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('Admin user not found. Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save();
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error during admin user creation:', error);
  }
};
*/

module.exports = app;
