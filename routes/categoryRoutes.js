const express = require('express');
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const validateFields = require('../middleware/validator');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    [body('name').notEmpty().withMessage('Category name is required and cannot be empty')],
    validateFields,
    categoryController.createCategory
  );

module.exports = router;