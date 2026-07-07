const dotenv = require('dotenv');
const path = require('path');

// التأكيد على قراءة ملف .env من المسار الرئيسي للمشروع
dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI
};