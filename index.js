/**
 * Devil - Minecraft AFK Bot
 * Entry point for the AFK bot application
 */

const { startBot } = require('./bot');
const logger = require('./utils/logger');
const keepAlive = require('./keep_alive');
const selfPing = require('./self_ping'); // Add self-pinging mechanism

logger.info('Starting Devil AFK Bot...');

// Start the keep-alive server for 24/7 operation
// This allows free uptime monitors to ping the bot and keep it running
logger.info('Starting keep-alive server for 24/7 operation');

// Start the bot with initial connection
startBot();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  
  // Restart the bot after a brief delay
  setTimeout(() => {
    logger.info('Attempting to restart after uncaught exception...');
    startBot();
  }, 10000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  // No need to restart here as the bot's reconnect logic will handle it
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('Received SIGINT signal. Shutting down...');
  keepAlive.close(() => {
    logger.info('Keep-alive server closed');
    process.exit(0);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM signal. Shutting down...');
  keepAlive.close(() => {
    logger.info('Keep-alive server closed');
    process.exit(0);
  });
});
