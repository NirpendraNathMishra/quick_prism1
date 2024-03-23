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
  billedclient: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  items: [
    {
      itemName: { type: String, required: true },
      //item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
});
let clientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  bills: [{ type: Schema.Types.ObjectId, ref: 'Bill' }]
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Item: mongoose.model('Item', itemSchema),
  Bill: mongoose.model('Bill', billSchema),
  Client: mongoose.model('Client', clientSchema)
};
