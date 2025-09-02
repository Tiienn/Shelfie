import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Environment validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'REDIS_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database
  database: {
    url: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === 'production',
    connectionTimeout: 60000,
    maxConnections: 10,
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL!,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: 'shelfie:',
    ttl: {
      session: 86400 * 7, // 7 days
      cache: 3600, // 1 hour
      rateLimiting: 900, // 15 minutes
    },
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET!,
    saltRounds: 12,
  },

  // AWS Services
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucketName: process.env.S3_BUCKET_NAME || 'shelfie-receipts',
      endpoint: process.env.S3_ENDPOINT, // For MinIO in development
      forcePathStyle: !!process.env.S3_ENDPOINT, // For MinIO
    },
    textract: {
      maxPages: 10,
      timeout: 30000,
    },
  },

  // AI Services
  ai: {
    claude: {
      apiKey: process.env.CLAUDE_API_KEY,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4000,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      maxTokens: 4000,
    },
    spoonacular: {
      apiKey: process.env.SPOONACULAR_API_KEY,
      baseUrl: 'https://api.spoonacular.com',
    },
  },

  // Message Queue
  queue: {
    redis: process.env.REDIS_URL!,
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
    queues: {
      ocrProcessing: 'ocr-processing',
      emailNotification: 'email-notification',
      syncOperation: 'sync-operation',
      recipeGeneration: 'recipe-generation',
    },
  },

  // Email
  email: {
    from: process.env.FROM_EMAIL || 'noreply@shelfie.app',
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },

  // Push Notifications
  notifications: {
    fcm: {
      serverKey: process.env.FCM_SERVER_KEY,
    },
  },

  // Rate Limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // File Upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ],
    tempDir: path.join(__dirname, '../../uploads/temp'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: {
      enabled: process.env.NODE_ENV === 'production',
      directory: path.join(__dirname, '../../logs'),
      filename: 'shelfie-%DATE%.log',
      maxSize: '20m',
      maxFiles: '14d',
    },
  },

  // Security
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://shelfie.app',
      'https://www.shelfie.app',
    ],
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    },
    googleAnalytics: {
      trackingId: process.env.GOOGLE_ANALYTICS_ID,
    },
  },

  // Payment Processing
  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },

  // External APIs
  externalApis: {
    barcodeLookup: {
      apiKey: process.env.BARCODE_API_KEY,
      baseUrl: 'https://api.barcodelookup.com/v3',
    },
    nutrition: {
      apiKey: process.env.NUTRITION_API_KEY,
      baseUrl: 'https://api.nutritionix.com/v1_1',
    },
  },

  // Feature Flags
  features: {
    ocrEnabled: process.env.FEATURE_OCR !== 'false',
    aiRecipesEnabled: process.env.FEATURE_AI_RECIPES !== 'false',
    communityDealsEnabled: process.env.FEATURE_COMMUNITY_DEALS === 'true',
    premiumFeaturesEnabled: process.env.FEATURE_PREMIUM === 'true',
  },
} as const;

// Type for configuration
export type Config = typeof config;