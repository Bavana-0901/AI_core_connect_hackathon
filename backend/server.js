const app = require('./src/app');
const Badge = require('./src/models/Badge');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Initialize default badges
const initializeBadges = async () => {
  try {
    const defaultBadges = [
      {
        name: 'First Task',
        description: 'Completed your first task',
        criteria: 'Complete 1 approved task',
      },
      {
        name: 'Task Master',
        description: 'Completed 10 tasks',
        criteria: 'Complete 10 approved tasks',
      },
      {
        name: 'GitHub Star',
        description: 'Achieved high GitHub score',
        criteria: 'GitHub score >= 80',
      },
      {
        name: 'Point Collector',
        description: 'Collected 100 points',
        criteria: 'Total points >= 100',
      },
    ];

    for (const badgeData of defaultBadges) {
      const existingBadge = await Badge.findOne({ name: badgeData.name });
      if (!existingBadge) {
        await Badge.create(badgeData);
        console.log(`Created badge: ${badgeData.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing badges:', error.message);
  }
};

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Start server
    const server = app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      // Initialize badges after server starts and DB is connected
      await initializeBadges();
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();