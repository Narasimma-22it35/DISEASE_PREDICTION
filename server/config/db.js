const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Server will continue without DB. Retrying in 30s...');
    setTimeout(connectDB, 30000);
  }
};

module.exports = connectDB;

