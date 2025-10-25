
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

CategorySchema.virtual('imageBase64').get(function () {
  if (this.image && this.image.data) {
    return `data:${this.image.contentType};base64,${this.image.data.toString('base64')}`;
  }
});

CategorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', CategorySchema);
