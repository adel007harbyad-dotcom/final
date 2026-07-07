const Product = require('../models/Product');
const AppError = require('../utils/appError');

// 1. جلب كل المنتجات مع بيانات القسم المقترن بها
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category', 'name description');
    res.status(200).json({ status: 'success', results: products.length, data: { products } });
  } catch (err) {
    next(err);
  }
};

// 2. جلب منتج واحد بالـ ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    if (!product) return next(new AppError('No product found with that ID', 404));
    
    res.status(200).json({ status: 'success', data: { product } });
  } catch (err) {
    next(err);
  }
};

// 3. إنشاء منتج جديد
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: { product: newProduct } });
  } catch (err) {
    next(err);
  }
};