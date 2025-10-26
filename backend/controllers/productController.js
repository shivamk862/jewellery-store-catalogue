const Product = require('../models/Product');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create a new product
exports.createProduct = [
  upload.single('image'),
  async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    try {
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        stock,
        image,
      });

      const product = await newProduct.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
];

// Get all products
exports.getProducts = async (req, res) => {
  const { category, search } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  try {
    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update a product
exports.updateProduct = [
  upload.single('image'),
  async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    const productFields = { name, description, price, category, stock };
    if (req.file) {
      productFields.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    try {
      let product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: productFields },
        { new: true }
      );

      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
];

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};