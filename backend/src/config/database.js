const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 20000,
        socketTimeoutMS: 60000,
        family: 4,
        retryWrites: true,
        retryReads: true,
        maxIdleTimeMS: 30000,
        heartbeatFrequencyMS: 10000,
        // Removed deprecated bufferMaxEntries and bufferCommands options
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      console.error(`MongoDB connection attempt ${retries} failed:`, error.message);

      if (retries < maxRetries) {
        console.log(`Retrying in 5 seconds... (${retries}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('Max retries reached. Falling back to local MongoDB...');

        // Fallback to local MongoDB
        try {
          const conn = await mongoose.connect('mongodb://localhost:27017/campusconnect', {
            serverSelectionTimeoutMS: 5000
          });
          console.log(`Fallback: MongoDB Connected to localhost: ${conn.connection.host}`);
          return;
        } catch (fallbackError) {
          console.error('Fallback connection also failed:', fallbackError.message);
          process.exit(1);
        }
      }
    }
  }
};

module.exports = connectDB;