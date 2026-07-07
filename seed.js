const mongoose = require('mongoose');
const config = require('./config/config');
const Category = require('./models/Category');
const Product = require('./models/Product');

// بيانات تجريبية للأقسام
const sampleCategories = [
  { name: 'Electronics', description: 'Gadgets, devices, and electronics' },
  { name: 'Clothing', description: 'Apparel, shoes, and fashion' },
  { name: 'Books', description: 'Educational and fiction books' }
];

const seedDatabase = async () => {
  try {
    // 1. الاتصال بقاعدة البيانات
    await mongoose.connect(config.mongoUri);
    console.log('Database connected for seeding...');

    // 2. تنظيف البيانات القديمة تماماً لحساب المخططات الحالية
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Old data cleared successfully.');

    // 3. إدخال الأقسام الجديدة في القاعدة
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('Sample categories inserted.');

    // 4. إعداد بيانات المنتجات التجريبية وربطها بالـ Category ID المناسب ديناميكياً
    const sampleProducts = [
      {
        name: 'Gaming Laptop',
        description: 'High performance gaming laptop with 16GB RAM',
        price: 1200,
        stock: 10,
        category: createdCategories[0]._id // ربطه بقسم الـ Electronics
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless optical mouse',
        price: 25,
        stock: 50,
        category: createdCategories[0]._id
      },
      {
        name: 'Leather Jacket',
        description: 'Classic black leather jacket for men',
        price: 150,
        stock: 5,
        category: createdCategories[1]._id // ربطه بقسم الـ Clothing
      },
      {
        name: 'JavaScript Guide',
        description: 'Learn Modern JavaScript from Scratch to Advanced',
        price: 45,
        stock: 100,
        category: createdCategories[2]._id // ربطه بقسم الـ Books
      }
    ];

    // 5. إدخال المنتجات في القاعدة
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted with correct Category references.');

    console.log('🚀 Seeding completed successfully!');
    process.exit(0); // إنهاء السكريبت بنجاح
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1); // إنهاء السكريبت بسبب خطأ
  }
};

// تشغيل الدالة
seedDatabase();