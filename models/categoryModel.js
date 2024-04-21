const { required } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter category name !'],

    unique: true
  },
  decription: {
    type: String,
    required: [true, 'Please enter category description !'],

    
  },

});


CategorySchema.pre('remove', async function(next) {
    await Product.deleteMany({ category: this._id });
    next();
  });






const category = mongoose.model('category', CategorySchema);

module.exports = category;
