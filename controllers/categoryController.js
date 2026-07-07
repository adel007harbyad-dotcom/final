const Category = require('../models/Category');
const AppError = require('../utils/appError');

// 1. جلب كل الأقسام
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', results: categories.length, data: { categories } });
  } catch (err) {
    next(err);
  }
};

// 2. إنشاء قسم جديد
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.create({ name, description });
    res.status(201).json({ status: 'success', data: { category: newCategory } });
  } catch (err) {
    if (err.code === 11000) return next(new AppError('Category name already exists', 400));
    next(err);
  }
};