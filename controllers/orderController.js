const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/appError');

// إنشاء طلب جديد بناءً على محتويات السلة الحالية
exports.createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne().populate('items.product');
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Your cart is empty', 400));
    }

    // 1. التحقق من المخزون لكل المنتجات في السلة أولاً
    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        return next(new AppError(`Not enough stock for product: ${item.product.name}`, 400));
      }
    }

    // 2. تجهيز عناصر الطلب وخصم المخزون
    const orderItems = [];
    for (let item of cart.items) {
      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      });

      // تقليل الكمية في المخزن (Stock reduction)
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // 3. إنشاء الطلب في قاعدة البيانات
    const order = await Order.create({
      items: orderItems,
      totalAmount: cart.totalPrice
    });

    // 4. تفريغ السلة بعد نجاح الطلب
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};

// جلب تفاصيل طلب معين بالـ ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name');
    if (!order) return next(new AppError('Order not found', 404));

    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) {
    next(err);
  }
};