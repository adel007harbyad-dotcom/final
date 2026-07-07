const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // يوقف السيرفر لو القاعدة مشغلتش
  }
};

module.exports = connectDB;