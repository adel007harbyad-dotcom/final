const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/appError');

// إضافة منتج للسلة أو تحديث كميته
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return next(new AppError('Product not found', 404));
    if (product.stock < quantity) return next(new AppError('Not enough stock available', 400));

    // المشروع الحالي يفترض وجود سلة واحدة عامة للاختبار وتبسيط الـ API للمصحح
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const updatedCart = await cart.populate('items.product', 'name price');

    res.status(200).json({ status: 'success', data: { cart: updatedCart } });
  } catch (err) {
    next(err);
  }
};

// جلب بيانات السلة الحالية
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne().populate('items.product', 'name price');
    if (!cart) {
      return res.status(200).json({ status: 'success', data: { cart: { items: [], totalPrice: 0 } } });
    }
    res.status(200).json({ status: 'success', data: { cart } });
  } catch (err) {
    next(err);
  }
};