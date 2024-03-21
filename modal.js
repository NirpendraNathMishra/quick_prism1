var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// User Schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique:false },
  
});

// Item Schema
var itemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  
});

// Bill Schema
var billSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
      quantity: { type: Number, required: true },
    }
  ],
  
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Item: mongoose.model('Item', itemSchema),
  Bill: mongoose.model('Bill', billSchema)
};
