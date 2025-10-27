
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/.env' });

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
      await createAdmin(); // Create admin user if it doesn't exist
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

const createAdmin = async () => {
  try {
    console.log('--- Running createAdmin function ---');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
      console.log('Admin credentials not found in .env file. Skipping admin creation.');
      return;
    }
    console.log(`Admin email from .env: ${adminEmail}`);

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
      // Log if the existing admin user has isAdmin set to true
      console.log(`Existing admin user isAdmin flag: ${existingAdmin.isAdmin}`);
    }
    console.log('--- Finished createAdmin function ---');
  } catch (error) {
    console.error('Error during admin user creation:', error);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Start the server if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

module.exports = app;
