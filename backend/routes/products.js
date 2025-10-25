
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const auth = require('../middleware/auth');

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, createProduct);

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, deleteProduct);

module.exports = router;
