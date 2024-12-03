const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET all items
router.get('/', itemController.getItems);

// POST a new item
router.post('/', itemController.addItem);

// PUT (update) an existing item
router.put('/:id', itemController.updateItem);

// PATCH (partially update) an existing item
router.patch('/:id', itemController.patchItem);

// DELETE an item by ID
router.delete('/:id', itemController.deleteItem);

module.exports = router;
