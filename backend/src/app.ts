import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { config } from './config';
import { corsOptions } from './config/cors';
import { morganStream } from './config/logger';
import { swaggerSpec } from './config/swagger';
import routes from './routes';
import { errorHandler, notFoundHandler, apiLimiter } from './middleware';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (config.env === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', { stream: morganStream }));
}

// Rate limiting
app.use('/api', apiLimiter);

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Electronics Store API Documentation',
}));

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        environment: config.env,
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
