import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { requestValidator } from './middleware/requestValidator';
import { corsOptions } from './config/cors';
import { socketHandler } from './services/socketService';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import inventoryRoutes from './routes/inventory.routes';
import receiptRoutes from './routes/receipt.routes';
import recipeRoutes from './routes/recipe.routes';
import groceryRoutes from './routes/grocery.routes';
import syncRoutes from './routes/sync.routes';
import healthRoutes from './routes/health.routes';

// Import services
import { DatabaseService } from './services/databaseService';
import { RedisService } from './services/redisService';
import { QueueService } from './services/queueService';

class Server {
  private app: express.Application;
  private httpServer: any;
  private io: SocketIOServer;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port || 3001;
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: corsOptions,
      transports: ['websocket', 'polling'],
    });

    this.initializeServices();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketHandlers();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize database connection
      await DatabaseService.initialize();
      logger.info('Database connection established');

      // Initialize Redis connection
      await RedisService.initialize();
      logger.info('Redis connection established');

      // Initialize queue service
      await QueueService.initialize();
      logger.info('Queue service initialized');

    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "wss:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS
    this.app.use(cors(corsOptions));

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression
    this.app.use(compression());

    // Request logging
    if (config.nodeEnv !== 'test') {
      this.app.use(morgan('combined', {
        stream: { 
          write: (message: string) => logger.info(message.trim()) 
        }
      }));
    }

    // Rate limiting
    this.app.use('/api', rateLimiter);

    // Request validation middleware
    this.app.use(requestValidator);

    // Health check (before rate limiting)
    this.app.use('/health', healthRoutes);
    this.app.use('/api/health', healthRoutes);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/v1/auth', authRoutes);
    this.app.use('/api/v1/users', userRoutes);
    this.app.use('/api/v1/inventory', inventoryRoutes);
    this.app.use('/api/v1/receipts', receiptRoutes);
    this.app.use('/api/v1/recipes', recipeRoutes);
    this.app.use('/api/v1/grocery', groceryRoutes);
    this.app.use('/api/v1/sync', syncRoutes);

    // API documentation
    if (config.nodeEnv !== 'production') {
      this.app.get('/api/docs', (req, res) => {
        res.json({
          title: 'Shelfie API Documentation',
          version: '1.0.0',
          description: 'Smart Pantry Management API',
          endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            inventory: '/api/v1/inventory',
            receipts: '/api/v1/receipts',
            recipes: '/api/v1/recipes',
            grocery: '/api/v1/grocery',
            sync: '/api/v1/sync',
            health: '/api/health',
          },
        });
      });
    }

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Shelfie API Server',
        version: '1.0.0',
        status: 'running',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  private initializeSocketHandlers(): void {
    socketHandler(this.io);
  }

  public start(): void {
    this.httpServer.listen(this.port, () => {
      logger.info(`🚀 Shelfie API Server running on port ${this.port}`);
      logger.info(`📚 API Documentation: http://localhost:${this.port}/api/docs`);
      logger.info(`🌍 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    // Close HTTP server
    this.httpServer.close(() => {
      logger.info('HTTP server closed');
    });

    // Close WebSocket connections
    this.io.close(() => {
      logger.info('Socket.IO server closed');
    });

    try {
      // Close database connections
      await DatabaseService.disconnect();
      logger.info('Database connections closed');

      // Close Redis connections
      await RedisService.disconnect();
      logger.info('Redis connections closed');

      // Close queue connections
      await QueueService.disconnect();
      logger.info('Queue connections closed');

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

export default Server;