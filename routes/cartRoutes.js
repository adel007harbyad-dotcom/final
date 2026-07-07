const express = require('express');
const { body } = require('express-validator');
const cartController = require('../controllers/cartController');
const validateFields = require('../middleware/validator');

const router = express.Router();

router
  .route('/')
  .get(cartController.getCart)
  .post(
    [
      body('productId').isMongoId().withMessage('Invalid Product ID format'),
      body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    validateFields,
    cartController.addToCart
  );

module.exports = router;