const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: String,
  address: String,
  city: String,
  municipio: String,
  postalCode: Number,
  phone: Number,
  email: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);
