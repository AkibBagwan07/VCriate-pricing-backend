const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricingController');

// Routes for Pricing Configuration CRUD operations

// Create a new pricing config
router.post('/configs', controller.createConfig);

// Retrieve all pricing configs
router.get('/configs', controller.getAllConfigs);

// Update a pricing config by ID
router.put('/configs/:id', controller.updateConfig);

// Delete a pricing config by ID
router.delete('/configs/:id', controller.deleteConfig);

// Route to calculate the price based on ride parameters
router.post('/calculate', controller.calculatePrice);

module.exports = router;
