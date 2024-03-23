let express = require('express');
let router = express.Router();
let { Item, Bill, Client } = require("../modal")

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).send('You must be logged in to access this route');
  }
}

// GET /bills
router.get('/', isAuthenticated, async function(req, res, next) {
  try {
    let bills = await Bill.find().populate('billedclient items.itemName');
    res.json(bills);
  } catch (err) {
    next(err);
  }
});


// POST /bills
router.post('/', isAuthenticated, async function(req, res, next) {
  try {
    let { billedclient, items, paymentMethod, paymentStatus } = req.body;
    let totalCost = 0;
    if (!billedclient || typeof billedclient !== 'string') {
      return res.status(400).send('Billed client is missing or not a string. Please enter a valid billed client.');
    }
    if (!items || !Array.isArray(items)) {
      return res.status(400).send('Items is missing or not an array. Please enter a valid list of items.');
    }
    for (let i = 0; i < items.length; i++) {
      if (!items[i].itemName || typeof items[i].itemName !== 'string') {
        return res.status(400).send('Item name is missing or not a string. Please enter a valid item name.');
      }
      if (items[i].quantity === undefined || !Number.isInteger(items[i].quantity)) {
        return res.status(400).send('Quantity is missing or not an integer. Please enter a valid quantity.');
      }
    }
    if (!paymentMethod || typeof paymentMethod !== 'string') {
      return res.status(400).send('Payment method is missing or not a string. Please enter a valid payment method.');
    }
    if (!paymentStatus || typeof paymentStatus !== 'string') {
      return res.status(400).send('Payment status is missing or not a string. Please enter a valid payment status.');
    }

    // Calculate total cost and update inventory
    for (let i = 0; i < items.length; i++) {
      let item = await Item.findOne({ name: items[i].itemName });  // Find the item in the database by name
      if (!item || item.quantity < items[i].quantity) {
        return res.status(400).send('Not enough inventory for item: ' + items[i].itemName);
      }
      item.quantity -= items[i].quantity;  // Decrease the quantity of the item
      await item.save();  // Save the updated item back to the database
      totalCost += item.price * items[i].quantity;
    }

    // Check if billed client exists
    let client = await Client.findOne({ name: billedclient });
    if (!client) {
      // If client does not exist, create a new client
      client = new Client({ name: billedclient });
      await client.save();
    }

    let bill = new Bill({ billedclient: client._id, items, totalCost, paymentMethod, paymentStatus });
    let savedBill = await bill.save();

    // Attach the bill to the client
    client.bills.push(savedBill._id);
    await client.save();

    res.status(201).json(savedBill);
  } catch (err) {
    next(err);
  }
});

  
  
// GET /bills/:clientName
router.get('/:clientName', isAuthenticated, async function(req, res, next) {
  try {
    let clientName = req.params.clientName;

    // Find the client
    let client = await Client.findOne({ name: clientName });
    if (!client) {
      return res.status(404).send('Client not found.');
    }

    // Find all bills for the client
    let bills = await Bill.find({ billedclient: client._id }).populate('billedclient items.itemName');
    res.json(bills);
  } catch (err) {
    next(err);
  }
});

// PUT /bills/:billId
// PUT /bills/:billId
router.put('/:billId', isAuthenticated, async function(req, res, next) {
  try {
    let billId = req.params.billId;
    let { billedclient, items, paymentMethod, paymentStatus } = req.body;
    if (!billedclient || typeof billedclient !== 'string') {
      return res.status(400).send('Billed client is missing or not a string. Please enter a valid billed client.');
    }
    if (!items || !Array.isArray(items)) {
      return res.status(400).send('Items is missing or not an array. Please enter a valid list of items.');
    }
    for (let i = 0; i < items.length; i++) {
      if (!items[i].itemName || typeof items[i].itemName !== 'string') {
        return res.status(400).send('Item name is missing or not a string. Please enter a valid item name.');
      }
      if (items[i].quantity === undefined || !Number.isInteger(items[i].quantity)) {
        return res.status(400).send('Quantity is missing or not an integer. Please enter a valid quantity.');
      }
    }
    if (!paymentMethod || typeof paymentMethod !== 'string') {
      return res.status(400).send('Payment method is missing or not a string. Please enter a valid payment method.');
    }
    if (!paymentStatus || typeof paymentStatus !== 'string') {
      return res.status(400).send('Payment status is missing or not a string. Please enter a valid payment status.');
    }

    // Find the bill
    let bill = await Bill.findById(billId).populate('items.itemName');
    if (!bill) {
      return res.status(404).send('Bill not found.');
    }

    // Revert the inventory based on the original bill
    for (let i = 0; i < bill.items.length; i++) {
      let item = await Item.findOne({ name: bill.items[i].itemName });
      if (item) {
        item.quantity += bill.items[i].quantity;  // Increase the quantity of the item in the inventory
        await item.save();
      }
    }

    // Update the bill
    if (billedclient) {
      let client = await Client.findOne({ name: billedclient });
      if (!client) {
        return res.status(404).send('Client not found.');
      }
      bill.billedclient = client._id;
    }
    if (items) {
      bill.items = items;
    }
    if (paymentMethod) {
      bill.paymentMethod = paymentMethod;
    }
    if (paymentStatus) {
      bill.paymentStatus = paymentStatus;
    }

    // Update the inventory based on the updated bill
    for (let i = 0; i < items.length; i++) {
      let item = await Item.findOne({ name: items[i].itemName });
      if (item && item.quantity >= items[i].quantity) {
        item.quantity -= items[i].quantity;  // Decrease the quantity of the item in the inventory
        await item.save();
      } else {
        return res.status(400).send('Not enough inventory for item: ' + items[i].itemName);
      }
    }

    // Save the updated bill
    let updatedBill = await bill.save();
    res.json(updatedBill);
  } catch (err) {
    next(err);
  }
});


// DELETE /bills/:billId
router.delete('/:billId', isAuthenticated, async function(req, res, next) {
  try {
    let billId = req.params.billId;

    // Find the bill
    let bill = await Bill.findById(billId).populate('items.itemName');
    if (!bill) {
      return res.status(404).send('Bill not found.');
    }
    for (let i = 0; i < bill.items.length; i++) {
      let item = await Item.findOne({ name: bill.items[i].itemName });
      if (item) {
        item.quantity += bill.items[i].quantity;
        await item.save();
      }
    }

    // Delete the bill
    await Bill.findByIdAndDelete(billId);

    res.status(200).send('Bill deleted successfully.');
  } catch (err) {
    next(err);
  }
});


module.exports = router;
