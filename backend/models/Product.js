const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

ProductSchema.virtual('imageBase64').get(function () {
  if (this.image && this.image.data) {
    return `data:${this.image.contentType};base64,${this.image.data.toString('base64')}`;
  }
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);