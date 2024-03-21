let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// User Schema
let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique:false },
  createdAt: { type: Date, default: Date.now }
});

// Item Schema
let itemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

// Bill Schema
let billSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentMethod: { type: String, required: true }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Item: mongoose.model('Item', itemSchema),
  Bill: mongoose.model('Bill', billSchema)
};
