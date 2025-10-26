
const Category = require('../models/Category');
const multer = require('multer');

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new category
exports.createCategory = [
  upload.single('image'),
  async (req, res) => {
    const { name } = req.body;
    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    try {
      const newCategory = new Category({ name, image });
      const category = await newCategory.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
];

// Update a category
exports.updateCategory = [
  upload.single('image'),
  async (req, res) => {
    const { name } = req.body;
    const categoryFields = { name };
    if (req.file) {
      categoryFields.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    try {
      let category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }

      category = await Category.findByIdAndUpdate(
        req.params.id,
        { $set: categoryFields },
        { new: true }
      );

      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
];

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
