import app from './app.js';

import 'dotenv/config';
import { connectDatabase } from './config/database.js';

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//Connecting to the database
(async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('error in the main function:', error);
  }
})();

let port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
