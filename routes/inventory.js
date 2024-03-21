let express = require('express');
let router = express.Router();
let Item = require('../modal').Item;

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).send('You must be logged in to access this route');
  }
}

// GET /inventory
router.get('/', isAuthenticated, async function(req, res, next) {
  try {
    let items = await Item.find();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /inventory
router.post('/', isAuthenticated, async function(req, res, next) {
    try {
      let { name, price, quantity, description } = req.body;
  
      if (!name || typeof name !== 'string') {
        return res.status(400).send('Name is missing or not a string. Please enter a valid name.');
      }
      if (price === undefined || typeof price !== 'number') {
        return res.status(400).send('Price is missing or not a number. Please enter a valid price.');
      }
      if (quantity === undefined || !Number.isInteger(quantity)) {
        return res.status(400).send('Quantity is missing or not an integer. Please enter a valid quantity.');
      }
      if (description && typeof description !== 'string') {
        return res.status(400).send('Description is not a string. Please enter a valid description.');
      }
  
      // Check if an item with the same name already exists
      let existingItem = await Item.findOne({ name: name });
      if (existingItem) {
        // If it does, update the quantity of the existing item
        existingItem.quantity += quantity;
        let updatedItem = await existingItem.save();
        res.status(200).json(updatedItem);
      } else {
        // If not, create a new item
        let item = new Item({ name, price, quantity, description });
        let savedItem = await item.save();
        res.status(201).json(savedItem);
      }
    } catch (err) {
      next(err);
    }
  });
  
  

// GET /inventory/:name
router.get('/:name', isAuthenticated, async function(req, res, next) {
  try {
    let item = await Item.findOne({ name: req.params.name });
    if (!item) {
      return res.status(404).send('Item not found');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// PUT /inventory/:name
router.put('/:name', isAuthenticated, async function(req, res, next) {
    try {
      let { quantity, price } = req.body;
  
      if (quantity === undefined || !Number.isInteger(quantity)) {
        return res.status(400).send('Quantity is missing or not an integer. Please enter a valid quantity.');
      }
      if (price === undefined || typeof price !== 'number') {
        return res.status(400).send('Price is missing or not a number. Please enter a valid price.');
      }

      let updatedItem = await Item.findOneAndUpdate({ name: req.params.name }, { quantity, price }, { new: true });
      console.log(updatedItem);
      if (!updatedItem) {
        return res.status(404).send('Item not found');
      }
      res.json(updatedItem);
    } catch (err) {
      next(err);
    }
  });
  

// DELETE /inventory/:name
router.delete('/:name', isAuthenticated, async function(req, res, next) {
  try {
    let deletedItem = await Item.findOneAndDelete({ name: req.params.name });
    if (!deletedItem) {
      return res.status(404).send('Item not found');
    }
    res.send("item Deleted with name "+req.params.name+" successfully")
  } catch (err) {
    next(err);
  }
});

module.exports = router;
