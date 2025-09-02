// Core Entity Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  expiryAlertDays: number;
  lowStockThreshold: number;
  dietaryRestrictions: string[];
  allergies: string[];
  preferredUnits: 'imperial' | 'metric';
  autoSyncEnabled: boolean;
  dataRetentionDays: number;
}

export interface Household {
  id: string;
  name: string;
  ownerId: string;
  settings: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum HouseholdRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER'
}

export interface HouseholdUser {
  id: string;
  householdId: string;
  userId: string;
  role: HouseholdRole;
  permissions: Record<string, any> | null;
  joinedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  brand: string | null;
  barcode: string | null;
  categoryId: string | null;
  defaultExpiryDays: number | null;
  nutritionData: NutritionData | null;
  imageUrl: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  householdId: string | null;
  parentId: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum StorageLocation {
  PANTRY = 'PANTRY',
  FRIDGE = 'FRIDGE',
  FREEZER = 'FREEZER',
  CUPBOARD = 'CUPBOARD',
  BASEMENT = 'BASEMENT',
  GARAGE = 'GARAGE',
  OTHER = 'OTHER'
}

export interface PantryItem {
  id: string;
  householdId: string;
  itemId: string;
  categoryId: string | null;
  quantity: number;
  unit: string;
  location: StorageLocation;
  expiryDate: Date | null;
  purchaseDate: Date | null;
  price: number | null;
  notes: string | null;
  customName: string | null;
  syncVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  MANUAL_REVIEW = 'MANUAL_REVIEW'
}

export interface Receipt {
  id: string;
  userId: string;
  householdId: string | null;
  storeName: string | null;
  storeAddress: string | null;
  imageUrl: string;
  ocrRawData: any;
  parsedItems: ParsedReceiptItem[];
  totalAmount: number | null;
  purchaseDate: Date | null;
  processingStatus: ProcessingStatus;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedReceiptItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category?: string;
  confidence: number;
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  difficulty: Difficulty;
  nutritionInfo: NutritionData | null;
  tags: string[];
  imageUrl: string | null;
  source: string | null;
  verified: boolean;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  optional?: boolean;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
  time?: number; // in minutes
  temperature?: number; // in celsius
}

export interface GroceryList {
  id: string;
  householdId: string;
  userId: string;
  name: string;
  description: string | null;
  items: GroceryListItem[];
  shared: boolean;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroceryListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  completed: boolean;
  price?: number;
  notes?: string;
  addedBy?: string; // userId
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  DESSERT = 'DESSERT'
}

export interface MealPlan {
  id: string;
  householdId: string;
  date: Date;
  mealType: MealType;
  recipeId: string | null;
  recipeName: string | null;
  servings: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  EXPIRY_WARNING = 'EXPIRY_WARNING',
  LOW_STOCK = 'LOW_STOCK',
  RECIPE_SUGGESTION = 'RECIPE_SUGGESTION',
  SHOPPING_REMINDER = 'SHOPPING_REMINDER',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',
  COMMUNITY_DEAL = 'COMMUNITY_DEAL'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any> | null;
  read: boolean;
  actionTaken: boolean;
  expiresAt: Date | null;
  createdAt: Date;
}

// Nutrition Data
export interface NutritionData {
  calories?: number;
  protein?: number; // grams
  carbohydrates?: number; // grams
  fat?: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // milligrams
  cholesterol?: number; // milligrams
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  servingSize?: string;
  servingsPerContainer?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  verified: boolean;
  role?: string;
  households: Household[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

// Sync Types
export interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  entityId: string;
  data: any;
  timestamp: number;
  retries: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  error?: string;
}

export interface SyncConflict {
  id: string;
  entityId: string;
  entityType: string;
  localVersion: number;
  serverVersion: number;
  localData: any;
  serverData: any;
  conflictType: 'UPDATE_UPDATE' | 'DELETE_UPDATE' | 'UPDATE_DELETE';
  resolvedData?: any;
  resolution?: 'CLIENT_WINS' | 'SERVER_WINS' | 'MERGE' | 'MANUAL';
  createdAt: Date;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  userId?: string;
  householdId?: string;
}

// OCR Types
export interface OCRResult {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ReceiptProcessingJob {
  id: string;
  receiptId: string;
  imageUrl: string;
  status: ProcessingStatus;
  progress: number;
  result?: ParsedReceiptItem[];
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: StorageLocation;
  expiringBefore?: Date;
  expiringAfter?: Date;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RecipeFilters extends SearchFilters {
  difficulty?: Difficulty;
  maxCookTime?: number;
  maxPrepTime?: number;
  dietaryRestrictions?: string[];
  ingredients?: string[];
  availableIngredientsOnly?: boolean;
}

// Error Types
export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;
}

// Feature Flag Types
export interface FeatureFlags {
  ocrEnabled: boolean;
  aiRecipesEnabled: boolean;
  communityDealsEnabled: boolean;
  premiumFeaturesEnabled: boolean;
}

// Configuration Types
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  features: FeatureFlags;
  limits: {
    maxFileSize: number;
    maxItemsPerList: number;
    maxReceiptsPerMonth: number;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];

export type NonNullable<T> = T extends null | undefined ? never : T;