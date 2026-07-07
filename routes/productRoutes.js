const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const validateFields = require('../middleware/validator');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    [
      body('name').notEmpty().withMessage('Product name is required'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('category').isMongoId().withMessage('Invalid Category ID format')
    ],
    validateFields,
    productController.createProduct
  );

router.route('/:id').get(productController.getProductById);

module.exports = router;