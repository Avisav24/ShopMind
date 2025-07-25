const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  isSustainable: Boolean,
  ecoScore: Number,
  category: { type: String, required: true } 
});

module.exports = mongoose.model('Product', productSchema);
