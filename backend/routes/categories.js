
const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getCategories);

// @route   POST api/categories
// @desc    Create a category
// @access  Private/Admin
router.post('/', [auth, admin], createCategory);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put('/:id', [auth, admin], updateCategory);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete('/:id', [auth, admin], deleteCategory);

module.exports = router;
