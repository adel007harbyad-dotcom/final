const config = require('./config/config'); 
const express = require('express');
const connectDB = require('./db/connection');
const mongoSanitize = require('express-mongo-sanitize');

// استدعاء جميع المسارات (Routes)
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();

// الاتصال بقاعدة بيانات MongoDB Atlas
connectDB();

// الـ Middlewares الأساسية والأمنية
app.use(express.json()); // لقراءة الـ JSON Body

// الحماية من هجمات NoSQL Injection (تمنع حَقن الأكواد الخبيثة في الاستعلامات)
app.use(mongoSanitize());

// تفعيل المسارات (Routes) في السيرفر
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

// مسار تجريبي أساسي للتأكد أن السيرفر شغال
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to E-Commerce API' });
});

// معالجة المسارات والروابط غير الموجودة (404)
app.use('*', (req, res, next) => {
  res.status(404).json({ status: 'fail', message: `Can't find ${req.originalUrl} on this server!` });
});

// معالج الأخطاء المركزي العالمي (Global Error Handler Middleware)
// أي خطأ يحصل في الـ Controllers بيبعت الرد هنا تلقائياً كـ JSON نظيف بدون كراش
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // يظهر تفاصيل الخطأ (Stack) فقط في وضع التطوير لمساعدتك على الإصلاح
    stack: config.env === 'development' ? err.stack : undefined
  });
});

// تشغيل السيرفر على البورت المحدد
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running in ${config.env} mode on port ${PORT}`);
});