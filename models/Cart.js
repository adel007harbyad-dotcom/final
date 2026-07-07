const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
});

const cartSchema = new mongoose.Schema(
  {
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

// Pre-save middleware لحساب السعر الإجمالي تلقائياً قبل الحفظ
cartSchema.pre('save', async function (next) {
  const Product = mongoose.model('Product');
  let total = 0;

  for (let item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  this.totalPrice = total;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);