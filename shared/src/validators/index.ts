import { z } from 'zod';
import { StorageLocation, Difficulty, HouseholdRole, MealType, NotificationType, ProcessingStatus } from '../types';

// Base validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional();
export const urlSchema = z.string().url('Invalid URL').optional();

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: phoneSchema,
  avatar: urlSchema,
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('light'),
  language: z.string().length(2).default('en'),
  timezone: z.string().default('UTC'),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  expiryAlertDays: z.number().int().min(1).max(30).default(3),
  lowStockThreshold: z.number().int().min(1).max(10).default(2),
  dietaryRestrictions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  preferredUnits: z.enum(['imperial', 'metric']).default('imperial'),
  autoSyncEnabled: z.boolean().default(true),
  dataRetentionDays: z.number().int().min(30).max(2555).default(365), // 7 years max
});

// Household validation schemas
export const createHouseholdSchema = z.object({
  name: z.string().min(2, 'Household name must be at least 2 characters').max(100, 'Household name must be less than 100 characters'),
  settings: z.record(z.any()).optional(),
});

export const updateHouseholdSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  settings: z.record(z.any()).optional(),
});

export const inviteUserSchema = z.object({
  email: emailSchema,
  role: z.nativeEnum(HouseholdRole).default(HouseholdRole.MEMBER),
});

// Item validation schemas
export const createItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(200, 'Item name must be less than 200 characters'),
  brand: z.string().max(100).optional(),
  barcode: z.string().max(50).optional(),
  categoryId: z.string().uuid().optional(),
  defaultExpiryDays: z.number().int().min(0).max(3650).optional(), // 10 years max
  nutritionData: z.record(z.any()).optional(),
  imageUrl: urlSchema,
});

export const updateItemSchema = createItemSchema.partial();

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
  parentId: z.string().uuid().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// Pantry item validation schemas
export const createPantryItemSchema = z.object({
  itemId: z.string().uuid('Invalid item ID'),
  categoryId: z.string().uuid().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit must be less than 20 characters'),
  location: z.nativeEnum(StorageLocation).default(StorageLocation.PANTRY),
  expiryDate: z.coerce.date().optional(),
  purchaseDate: z.coerce.date().optional(),
  price: z.number().positive().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  customName: z.string().max(200).optional(),
});

export const updatePantryItemSchema = z.object({
  quantity: z.number().positive().optional(),
  unit: z.string().min(1).max(20).optional(),
  location: z.nativeEnum(StorageLocation).optional(),
  expiryDate: z.coerce.date().nullable().optional(),
  purchaseDate: z.coerce.date().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
  customName: z.string().max(200).nullable().optional(),
});

// Recipe validation schemas
export const recipeIngredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string().optional(),
  optional: z.boolean().default(false),
});

export const recipeInstructionSchema = z.object({
  step: z.number().int().positive('Step number must be positive'),
  instruction: z.string().min(1, 'Instruction is required'),
  time: z.number().int().positive().optional(), // minutes
  temperature: z.number().int().positive().optional(), // celsius
});

export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required').max(200, 'Recipe name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  ingredients: z.array(recipeIngredientSchema).min(1, 'Recipe must have at least one ingredient'),
  instructions: z.array(recipeInstructionSchema).min(1, 'Recipe must have at least one instruction'),
  prepTime: z.number().int().positive().optional(),
  cookTime: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  difficulty: z.nativeEnum(Difficulty).default(Difficulty.MEDIUM),
  nutritionInfo: z.record(z.any()).optional(),
  tags: z.array(z.string()).default([]),
  imageUrl: urlSchema,
  source: z.string().max(500).optional(),
});

export const updateRecipeSchema = createRecipeSchema.partial();

// Grocery list validation schemas
export const groceryListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  category: z.string().optional(),
  completed: z.boolean().default(false),
  price: z.number().positive().optional(),
  notes: z.string().max(200).optional(),
  addedBy: z.string().uuid().optional(),
});

export const createGroceryListSchema = z.object({
  name: z.string().min(1, 'List name is required').max(100, 'List name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  items: z.array(groceryListItemSchema).default([]),
  shared: z.boolean().default(false),
  dueDate: z.coerce.date().optional(),
});

export const updateGroceryListSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  items: z.array(groceryListItemSchema).optional(),
  shared: z.boolean().optional(),
  completed: z.boolean().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

// Meal plan validation schemas
export const createMealPlanSchema = z.object({
  date: z.coerce.date(),
  mealType: z.nativeEnum(MealType),
  recipeId: z.string().uuid().optional(),
  recipeName: z.string().max(200).optional(),
  servings: z.number().int().positive().default(1),
  notes: z.string().max(500).optional(),
}).refine((data) => data.recipeId || data.recipeName, {
  message: 'Either recipeId or recipeName must be provided',
  path: ['recipeId'],
});

export const updateMealPlanSchema = createMealPlanSchema.partial();

// Receipt validation schemas
export const receiptUploadSchema = z.object({
  householdId: z.string().uuid().optional(),
  storeName: z.string().max(100).optional(),
  storeAddress: z.string().max(500).optional(),
  purchaseDate: z.coerce.date().optional(),
});

export const updateReceiptSchema = z.object({
  storeName: z.string().max(100).nullable().optional(),
  storeAddress: z.string().max(500).nullable().optional(),
  parsedItems: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().positive(),
    unit: z.string().min(1),
    price: z.number().positive(),
    category: z.string().optional(),
    confidence: z.number().min(0).max(1),
  })).optional(),
  totalAmount: z.number().positive().nullable().optional(),
  purchaseDate: z.coerce.date().nullable().optional(),
  processingStatus: z.nativeEnum(ProcessingStatus).optional(),
});

// Notification validation schemas
export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
  data: z.record(z.any()).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
  actionTaken: z.boolean().optional(),
});

// Search and filter validation schemas
export const searchFiltersSchema = z.object({
  query: z.string().max(200).optional(),
  category: z.string().uuid().optional(),
  location: z.nativeEnum(StorageLocation).optional(),
  expiringBefore: z.coerce.date().optional(),
  expiringAfter: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const recipeFiltersSchema = searchFiltersSchema.extend({
  difficulty: z.nativeEnum(Difficulty).optional(),
  maxCookTime: z.number().int().positive().optional(),
  maxPrepTime: z.number().int().positive().optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  availableIngredientsOnly: z.boolean().default(false),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine((mime) => [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ].includes(mime), 'Invalid file type'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'), // 10MB
});

// Sync operation validation schemas
export const syncOperationSchema = z.object({
  type: z.enum(['CREATE', 'UPDATE', 'DELETE']),
  entity: z.string().min(1),
  entityId: z.string().uuid(),
  data: z.record(z.any()),
  timestamp: z.number().int().positive(),
});

export const batchSyncSchema = z.object({
  operations: z.array(syncOperationSchema).max(100, 'Maximum 100 operations per batch'),
});

// WebSocket message validation schemas
export const webSocketMessageSchema = z.object({
  type: z.string().min(1),
  payload: z.record(z.any()),
  timestamp: z.number().int().positive(),
  userId: z.string().uuid().optional(),
  householdId: z.string().uuid().optional(),
});

// Utility validation functions
export const validateUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

// Validation error formatter
export const formatZodError = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
};

// Generic validation middleware type
export type ValidationSchema = z.ZodSchema<any>;