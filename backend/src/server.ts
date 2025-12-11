import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';
import { logger } from './config/logger';

const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await connectDatabase();
        logger.info('MongoDB connected successfully');

        // Connect to Redis (optional, won't fail if not available)
        try {
            await connectRedis();
            logger.info('Redis connected successfully');
        } catch (error) {
            logger.warn('Redis connection failed, caching disabled');
        }

        // Start server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
            logger.info(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
            logger.info(`❤️  Health check: http://localhost:${config.port}/health`);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal: string) => {
            logger.info(`${signal} received. Shutting down gracefully...`);
            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
