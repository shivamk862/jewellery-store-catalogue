
const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
} = require('../controllers/cartController');
const auth = require('../middleware/auth');

// @route   GET api/cart
// @desc    Get user cart
// @access  Private
router.get('/', auth, getCart);

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, addItemToCart);

// @route   DELETE api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', auth, removeItemFromCart);

module.exports = router;
