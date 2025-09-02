# Technical Architecture Document
# Pantry & Grocery Management App

**Version:** 1.0  
**Date:** September 2025  
**Status:** Draft  
**Author:** Engineering Team  
**Document Type:** System Design Document (SDD)

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture Principles](#3-architecture-principles)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Component Architecture](#5-component-architecture)
6. [Data Architecture](#6-data-architecture)
7. [Receipt Scanning OCR Pipeline](#7-receipt-scanning-ocr-pipeline)
8. [AI Recipe Recommendation Engine](#8-ai-recipe-recommendation-engine)
9. [Offline-First & PWA Architecture](#9-offline-first--pwa-architecture)
10. [API Design](#10-api-design)
11. [Security Architecture](#11-security-architecture)
12. [Infrastructure & Deployment](#12-infrastructure--deployment)
13. [Performance & Scalability](#13-performance--scalability)
14. [Monitoring & Observability](#14-monitoring--observability)
15. [Development Workflow](#15-development-workflow)
16. [Architecture Decision Records](#16-architecture-decision-records)

---

## 1. Executive Summary

### 1.1 Purpose
This document describes the technical architecture for the Pantry & Grocery Management App, a Progressive Web Application (PWA) designed to help busy mothers efficiently manage household inventory through intelligent automation, receipt scanning, and AI-powered recommendations.

### 1.2 Architecture Highlights
- **Microservices-based backend** with event-driven communication
- **Serverless OCR pipeline** for receipt processing
- **Offline-first PWA** with service workers and IndexedDB
- **Real-time synchronization** using WebSockets and CRDT
- **AI/ML services** for recipe recommendations and item classification
- **Auto-scaling infrastructure** on AWS/GCP

### 1.3 Key Technologies
- Frontend: React/Next.js, PWA, Service Workers
- Backend: Node.js, Python (ML services)
- Database: PostgreSQL, Redis, IndexedDB
- ML/AI: TensorFlow, Claude API, AWS Textract
- Infrastructure: Docker, Kubernetes, AWS/GCP

---

## 2. System Overview

### 2.1 System Context

```mermaid
graph TB
    subgraph "External Systems"
        OCR[OCR Services<br/>AWS Textract/Google Vision]
        Recipe[Recipe APIs<br/>Spoonacular/Custom]
        Auth[Auth Provider<br/>Auth0/Firebase]
        Payment[Payment Gateway<br/>Stripe]
        CDN[CDN<br/>CloudFlare]
    end
    
    subgraph "Pantry App System"
        PWA[Progressive Web App]
        API[API Gateway]
        Services[Microservices]
        DB[(Databases)]
    end
    
    subgraph "Users"
        Mobile[Mobile Users]
        Desktop[Desktop Users]
    end
    
    Mobile --> PWA
    Desktop --> PWA
    PWA --> API
    API --> Services
    Services --> DB
    Services --> OCR
    Services --> Recipe
    Services --> Auth
    Services --> Payment
    CDN --> PWA
```

### 2.2 Non-Functional Requirements

| Requirement | Target | Measurement |
|------------|--------|-------------|
| **Availability** | 99.9% uptime | Monthly SLA |
| **Response Time** | < 200ms p95 | API latency |
| **OCR Processing** | < 5 seconds | End-to-end |
| **Offline Support** | Full CRUD operations | Feature coverage |
| **Concurrent Users** | 10,000+ | Peak capacity |
| **Data Durability** | 99.999999999% | Annual measurement |

---

## 3. Architecture Principles

### 3.1 Core Principles

1. **Offline-First Design**
   - All features work offline with eventual consistency
   - Sync when connection available
   - Conflict resolution via CRDT

2. **Mobile-First Responsive**
   - Touch-optimized interfaces
   - Progressive enhancement
   - Adaptive loading strategies

3. **Microservices Architecture**
   - Domain-driven design
   - Service autonomy
   - Event-driven communication

4. **Security by Design**
   - Zero-trust architecture
   - End-to-end encryption
   - OWASP compliance

5. **Performance Optimization**
   - Edge caching
   - Lazy loading
   - Code splitting

---

## 4. High-Level Architecture

### 4.1 System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        PWA[PWA Client]
        SW[Service Worker]
        IDB[(IndexedDB)]
        Cache[(Cache Storage)]
    end
    
    subgraph "API Gateway Layer"
        APIGW[API Gateway<br/>Rate Limiting, Auth]
        WS[WebSocket Server<br/>Real-time Sync]
    end
    
    subgraph "Service Layer"
        Auth[Auth Service]
        Inventory[Inventory Service]
        OCR[OCR Service]
        Recipe[Recipe Service]
        Notification[Notification Service]
        Sync[Sync Service]
    end
    
    subgraph "Message Queue"
        Queue[RabbitMQ/SQS]
        Events[Event Bus]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL<br/>Primary Data)]
        Redis[(Redis<br/>Cache & Sessions)]
        S3[(S3/Cloud Storage<br/>Images & Files)]
        ES[(ElasticSearch<br/>Search & Analytics)]
    end
    
    PWA --> SW
    SW --> Cache
    PWA --> IDB
    PWA --> APIGW
    PWA --> WS
    
    APIGW --> Auth
    APIGW --> Inventory
    APIGW --> OCR
    APIGW --> Recipe
    
    WS --> Sync
    
    Inventory --> Queue
    OCR --> Queue
    Recipe --> Queue
    
    Queue --> Events
    Events --> Notification
    Events --> Sync
    
    Inventory --> PG
    Inventory --> Redis
    OCR --> S3
    Recipe --> ES
    Sync --> PG
```

### 4.2 Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| PWA Client | User interface, offline capability | React, Service Workers |
| API Gateway | Request routing, auth, rate limiting | Kong/Express Gateway |
| Auth Service | User authentication & authorization | Auth0/Firebase Auth |
| Inventory Service | CRUD operations for pantry items | Node.js, PostgreSQL |
| OCR Service | Receipt processing pipeline | Python, TensorFlow |
| Recipe Service | AI recommendations | Python, ML models |
| Sync Service | Data synchronization | Node.js, WebSockets |
| Notification Service | Push notifications, alerts | FCM, SendGrid |

---

## 5. Component Architecture

### 5.1 Frontend Architecture (PWA)

```typescript
// Frontend Module Structure
src/
├── components/           # Reusable UI components
│   ├── common/
│   ├── pantry/
│   ├── recipes/
│   └── scanner/
├── hooks/               # Custom React hooks
│   ├── useOfflineSync.ts
│   ├── useCamera.ts
│   └── useOCR.ts
├── services/            # API & service layer
│   ├── api/
│   ├── offline/
│   └── sync/
├── store/               # State management (Redux/Zustand)
│   ├── slices/
│   └── middleware/
├── workers/             # Web Workers & Service Workers
│   ├── service-worker.ts
│   └── sync-worker.ts
└── utils/               # Utilities & helpers
```

#### 5.1.1 State Management Architecture

```typescript
// Zustand Store with Offline Persistence
interface PantryStore {
  items: PantryItem[];
  pendingSync: SyncOperation[];
  
  // Actions
  addItem: (item: PantryItem) => void;
  updateItem: (id: string, updates: Partial<PantryItem>) => void;
  deleteItem: (id: string) => void;
  
  // Sync operations
  syncWithServer: () => Promise<void>;
  resolveConflicts: (conflicts: Conflict[]) => void;
}

// IndexedDB Schema
interface OfflineDatabase {
  pantryItems: {
    key: string;
    value: PantryItem;
    indexes: ['category', 'expiryDate', 'syncStatus'];
  };
  receipts: {
    key: string;
    value: Receipt;
    indexes: ['date', 'status'];
  };
  pendingOperations: {
    key: string;
    value: SyncOperation;
    indexes: ['timestamp', 'type'];
  };
}
```

### 5.2 Backend Microservices Architecture

#### 5.2.1 Inventory Service

```javascript
// Inventory Service Structure
inventory-service/
├── src/
│   ├── controllers/
│   │   ├── ItemController.js
│   │   └── CategoryController.js
│   ├── models/
│   │   ├── Item.js
│   │   └── Category.js
│   ├── services/
│   │   ├── InventoryService.js
│   │   └── ExpiryMonitor.js
│   ├── repositories/
│   │   └── ItemRepository.js
│   ├── events/
│   │   ├── publishers/
│   │   └── subscribers/
│   └── middleware/
│       ├── auth.js
│       └── validation.js
├── tests/
└── Dockerfile
```

#### 5.2.2 Event-Driven Communication

```javascript
// Event Bus Implementation
class EventBus {
  async publish(eventType, payload) {
    const event = {
      id: uuid(),
      type: eventType,
      timestamp: new Date(),
      payload,
      metadata: {
        service: process.env.SERVICE_NAME,
        version: process.env.SERVICE_VERSION
      }
    };
    
    await this.queue.send(event);
    await this.logEvent(event);
  }
  
  async subscribe(eventType, handler) {
    this.queue.on(eventType, async (event) => {
      try {
        await handler(event);
        await this.acknowledgeEvent(event);
      } catch (error) {
        await this.handleError(event, error);
      }
    });
  }
}

// Event Types
const Events = {
  ITEM_ADDED: 'inventory.item.added',
  ITEM_EXPIRED: 'inventory.item.expired',
  RECEIPT_PROCESSED: 'ocr.receipt.processed',
  RECIPE_SUGGESTED: 'recipe.suggestion.created'
};
```

---

## 6. Data Architecture

### 6.1 Database Schema

```sql
-- Core Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id),
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    barcode VARCHAR(50),
    category_id UUID REFERENCES categories(id),
    default_expiry_days INTEGER,
    nutrition_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id),
    item_id UUID REFERENCES items(id),
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    location VARCHAR(50), -- pantry, fridge, freezer
    expiry_date DATE,
    purchase_date DATE,
    price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_version INTEGER DEFAULT 0
);

CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id),
    store_name VARCHAR(255),
    image_url TEXT,
    raw_ocr_data JSONB,
    parsed_items JSONB,
    total_amount DECIMAL(10,2),
    purchase_date TIMESTAMP,
    processing_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_pantry_items_household ON pantry_items(household_id);
CREATE INDEX idx_pantry_items_expiry ON pantry_items(expiry_date);
CREATE INDEX idx_pantry_items_sync ON pantry_items(sync_version);
CREATE INDEX idx_receipts_household ON receipts(household_id);
CREATE INDEX idx_receipts_status ON receipts(processing_status);
```

### 6.2 Data Synchronization Strategy

```typescript
// CRDT-based Sync Implementation
interface SyncStrategy {
  // Last-Write-Wins Register for simple fields
  mergeLWW<T>(local: T, remote: T, localTime: Date, remoteTime: Date): T;
  
  // Counter CRDT for quantities
  mergeCounter(local: number, remote: number, operation: 'add' | 'subtract'): number;
  
  // OR-Set for collections
  mergeSet<T>(local: Set<T>, remote: Set<T>): Set<T>;
  
  // Vector Clock for causality tracking
  compareVectorClocks(vc1: VectorClock, vc2: VectorClock): 'before' | 'after' | 'concurrent';
}

class ConflictResolver {
  resolve(conflicts: Conflict[]): Resolution[] {
    return conflicts.map(conflict => {
      switch (conflict.type) {
        case 'UPDATE_UPDATE':
          return this.resolveUpdateConflict(conflict);
        case 'DELETE_UPDATE':
          return this.resolveDeleteConflict(conflict);
        default:
          return this.defaultResolution(conflict);
      }
    });
  }
}
```

---

## 7. Receipt Scanning OCR Pipeline

### 7.1 OCR Processing Architecture

```mermaid
sequenceDiagram
    participant User
    participant PWA
    participant API
    participant Queue
    participant OCR as OCR Service
    participant ML as ML Classifier
    participant Storage as S3
    participant DB
    
    User->>PWA: Take receipt photo
    PWA->>PWA: Compress & optimize image
    PWA->>API: Upload receipt
    API->>Storage: Store original image
    API->>Queue: Queue OCR job
    API->>PWA: Return job ID
    
    Queue->>OCR: Process receipt
    OCR->>OCR: Preprocess image
    OCR->>OCR: Text detection (Textract/Vision)
    OCR->>ML: Classify items
    ML->>ML: Extract entities
    ML->>DB: Save parsed data
    OCR->>Queue: Publish completion event
    
    Queue->>API: Notify completion
    API->>PWA: Push notification
    PWA->>API: Fetch results
    API->>DB: Get parsed items
    API->>PWA: Return items
```

### 7.2 OCR Service Implementation

```python
# OCR Processing Pipeline
class ReceiptOCRPipeline:
    def __init__(self):
        self.preprocessor = ImagePreprocessor()
        self.ocr_engine = OCREngine()  # Textract/Vision API
        self.parser = ReceiptParser()
        self.classifier = ItemClassifier()
        
    async def process_receipt(self, image_url: str) -> ReceiptData:
        # 1. Download and preprocess image
        image = await self.download_image(image_url)
        processed_image = self.preprocessor.process(image)
        
        # 2. Extract text using OCR
        raw_text = await self.ocr_engine.extract_text(processed_image)
        
        # 3. Parse receipt structure
        structured_data = self.parser.parse(raw_text)
        
        # 4. Classify and extract items
        items = await self.classifier.extract_items(structured_data)
        
        # 5. Post-process and validate
        validated_items = self.validate_items(items)
        
        return ReceiptData(
            items=validated_items,
            total=structured_data.total,
            store=structured_data.store,
            date=structured_data.date
        )

class ImagePreprocessor:
    def process(self, image):
        # Apply image processing techniques
        pipeline = [
            self.deskew,
            self.remove_noise,
            self.enhance_contrast,
            self.binarize,
            self.crop_receipt
        ]
        
        for operation in pipeline:
            image = operation(image)
        
        return image
    
    def deskew(self, image):
        # Correct image rotation
        angle = self.detect_skew(image)
        return self.rotate(image, -angle)
    
    def enhance_contrast(self, image):
        # Improve text visibility
        return cv2.equalizeHist(image)
```

### 7.3 ML Item Classification

```python
# Item Classification Model
class ItemClassifier:
    def __init__(self):
        self.model = self.load_model()
        self.tokenizer = self.load_tokenizer()
        self.categories = self.load_categories()
        
    async def extract_items(self, text_lines):
        items = []
        
        for line in text_lines:
            # Extract features
            features = self.extract_features(line)
            
            # Classify line type
            line_type = self.classify_line(features)
            
            if line_type == 'ITEM':
                item = self.parse_item_line(line)
                item.category = await self.categorize_item(item.name)
                items.append(item)
                
        return items
    
    def categorize_item(self, item_name):
        # Use pre-trained model or API
        embedding = self.get_embedding(item_name)
        category_scores = self.model.predict(embedding)
        return self.categories[np.argmax(category_scores)]
```

---

## 8. AI Recipe Recommendation Engine

### 8.1 Recommendation Architecture

```python
# Recipe Recommendation System
class RecipeRecommendationEngine:
    def __init__(self):
        self.ingredient_matcher = IngredientMatcher()
        self.recipe_ranker = RecipeRanker()
        self.personalization = PersonalizationEngine()
        
    async def get_recommendations(
        self, 
        pantry_items: List[Item],
        user_preferences: UserPreferences,
        constraints: Constraints
    ) -> List[Recipe]:
        
        # 1. Match recipes by ingredients
        candidate_recipes = await self.ingredient_matcher.find_matches(
            pantry_items,
            min_match_ratio=0.6
        )
        
        # 2. Apply dietary filters
        filtered_recipes = self.apply_constraints(
            candidate_recipes,
            constraints
        )
        
        # 3. Personalize based on history
        personalized_scores = await self.personalization.score_recipes(
            filtered_recipes,
            user_preferences
        )
        
        # 4. Rank and select top recipes
        ranked_recipes = self.recipe_ranker.rank(
            filtered_recipes,
            personalized_scores
        )
        
        return ranked_recipes[:10]

class IngredientMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.ingredient_embeddings = self.load_embeddings()
        
    async def find_matches(self, pantry_items, min_match_ratio):
        # Convert pantry items to searchable format
        pantry_vector = self.vectorize_pantry(pantry_items)
        
        # Search recipe database
        matches = await self.similarity_search(
            pantry_vector,
            threshold=min_match_ratio
        )
        
        return matches
    
    def calculate_match_score(self, recipe, pantry_items):
        recipe_ingredients = set(recipe.ingredients)
        available_ingredients = set(pantry_items)
        
        intersection = recipe_ingredients & available_ingredients
        match_ratio = len(intersection) / len(recipe_ingredients)
        
        return {
            'match_ratio': match_ratio,
            'matched_items': list(intersection),
            'missing_items': list(recipe_ingredients - available_ingredients)
        }
```

### 8.2 AI Integration

```javascript
// Claude API Integration for Recipe Generation
class AIRecipeGenerator {
  async generateRecipe(ingredients, preferences) {
    const prompt = this.buildPrompt(ingredients, preferences);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });
    
    const data = await response.json();
    return this.parseRecipeResponse(data.content[0].text);
  }
  
  buildPrompt(ingredients, preferences) {
    return `Generate a recipe using these ingredients: ${ingredients.join(', ')}.
            Dietary preferences: ${preferences}.
            Format as JSON with title, ingredients, instructions, prep_time, cook_time.`;
  }
}
```

---

## 9. Offline-First & PWA Architecture

### 9.1 Service Worker Strategy

```javascript
// Service Worker Implementation
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
  STATIC: `static-${CACHE_VERSION}`,
  DYNAMIC: `dynamic-${CACHE_VERSION}`,
  IMAGES: `images-${CACHE_VERSION}`,
  API: `api-${CACHE_VERSION}`
};

// Install Event - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/css/main.css',
        '/static/js/bundle.js',
        '/manifest.json',
        '/offline.html'
      ]);
    })
  );
  self.skipWaiting();
});

// Fetch Event - Network-first with cache fallback for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API calls - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
  }
  // Images - Cache first, network fallback
  else if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request));
  }
  // Static assets - Cache first
  else {
    event.respondWith(cacheFirstStrategy(request));
  }
});

// Background Sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pantry-items') {
    event.waitUntil(syncPantryItems());
  }
});

async function syncPantryItems() {
  const db = await openDB('PantryDB', 1);
  const tx = db.transaction('pending_sync', 'readonly');
  const pendingItems = await tx.store.getAll();
  
  for (const item of pendingItems) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Remove from pending after successful sync
      await db.delete('pending_sync', item.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}
```

### 9.2 IndexedDB Schema & Operations

```javascript
// IndexedDB Operations
class OfflineDatabase {
  constructor() {
    this.dbName = 'PantryDB';
    this.version = 1;
  }
  
  async init() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db, oldVersion, newVersion) {
        // Pantry Items Store
        if (!db.objectStoreNames.contains('pantry_items')) {
          const pantryStore = db.createObjectStore('pantry_items', {
            keyPath: 'id',
            autoIncrement: false
          });
          pantryStore.createIndex('category', 'category');
          pantryStore.createIndex('expiry_date', 'expiry_date');
          pantryStore.createIndex('sync_status', 'sync_status');
        }
        
        // Pending Sync Store
        if (!db.objectStoreNames.contains('pending_sync')) {
          const syncStore = db.createObjectStore('pending_sync', {
            keyPath: 'id'
          });
          syncStore.createIndex('timestamp', 'timestamp');
          syncStore.createIndex('operation', 'operation');
        }
        
        // Receipts Store
        if (!db.objectStoreNames.contains('receipts')) {
          const receiptStore = db.createObjectStore('receipts', {
            keyPath: 'id'
          });
          receiptStore.createIndex('date', 'date');
          receiptStore.createIndex('status', 'status');
        }
      }
    });
  }
  
  async addItem(item) {
    const tx = this.db.transaction('pantry_items', 'readwrite');
    const store = tx.objectStore('pantry_items');
    
    // Add to local store
    await store.add({
      ...item,
      sync_status: 'pending',
      local_timestamp: Date.now()
    });
    
    // Queue for sync
    await this.queueSync({
      id: item.id,
      operation: 'add',
      data: item,
      timestamp: Date.now()
    });
    
    // Request background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-pantry-items');
    }
  }
}
```

### 9.3 Real-time Sync with WebSockets

```javascript
// WebSocket Sync Manager
class SyncManager {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }
  
  connect() {
    this.ws = new WebSocket(process.env.WS_URL);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.authenticate();
      this.syncPendingChanges();
    };
    
    this.ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      await this.handleMessage(message);
    };
    
    this.ws.onclose = () => {
      this.handleDisconnect();
    };
  }
  
  async handleMessage(message) {
    switch (message.type) {
      case 'ITEM_UPDATED':
        await this.handleItemUpdate(message.data);
        break;
      case 'CONFLICT':
        await this.resolveConflict(message.data);
        break;
      case 'SYNC_COMPLETE':
        await this.handleSyncComplete(message.data);
        break;
    }
  }
  
  async resolveConflict(conflict) {
    // CRDT-based conflict resolution
    const localItem = await this.getLocalItem(conflict.itemId);
    const remoteItem = conflict.remoteItem;
    
    const resolved = this.crdt.merge(localItem, remoteItem);
    await this.updateLocalItem(resolved);
    
    this.ws.send(JSON.stringify({
      type: 'CONFLICT_RESOLVED',
      data: resolved
    }));
  }
}
```

---

## 10. API Design

### 10.1 RESTful API Endpoints

```yaml
# OpenAPI Specification
openapi: 3.0.0
info:
  title: Pantry Management API
  version: 1.0.0

paths:
  /api/v1/pantry/items:
    get:
      summary: Get all pantry items
      parameters:
        - name: household_id
          in: query
          required: true
          schema:
            type: string
        - name: category
          in: query
          schema:
            type: string
        - name: location
          in: query
          schema:
            enum: [pantry, fridge, freezer]
      responses:
        200:
          description: List of pantry items
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PantryItem'
    
    post:
      summary: Add new pantry item
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PantryItemInput'
      responses:
        201:
          description: Item created
          
  /api/v1/receipts/scan:
    post:
      summary: Upload receipt for OCR processing
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                metadata:
                  type: object
      responses:
        202:
          description: Processing started
          content:
            application/json:
              schema:
                type: object
                properties:
                  job_id:
                    type: string
                  status_url:
                    type: string
                    
  /api/v1/recipes/recommend:
    post:
      summary: Get recipe recommendations
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                pantry_items:
                  type: array
                  items:
                    type: string
                dietary_restrictions:
                  type: array
                  items:
                    type: string
                max_results:
                  type: integer
      responses:
        200:
          description: Recipe recommendations
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Recipe'

components:
  schemas:
    PantryItem:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        quantity:
          type: number
        unit:
          type: string
        category:
          type: string
        expiry_date:
          type: string
          format: date
        location:
          type: string
```

### 10.2 GraphQL Schema (Alternative)

```graphql
# GraphQL Schema
type Query {
  pantryItems(householdId: ID!, filter: ItemFilter): [PantryItem!]!
  recipes(ingredients: [String!]!, preferences: RecipePreferences): [Recipe!]!
  receipt(id: ID!): Receipt
}

type Mutation {
  addPantryItem(input: PantryItemInput!): PantryItem!
  updatePantryItem(id: ID!, input: PantryItemUpdate!): PantryItem!
  deletePantryItem(id: ID!): Boolean!
  scanReceipt(image: Upload!): ScanJob!
  syncPantryItems(items: [PantryItemSync!]!): SyncResult!
}

type Subscription {
  pantryItemUpdated(householdId: ID!): PantryItem!
  receiptProcessed(jobId: ID!): Receipt!
  expiryAlert(householdId: ID!): ExpiryNotification!
}

type PantryItem {
  id: ID!
  name: String!
  quantity: Float!
  unit: String!
  category: Category!
  expiryDate: Date
  location: StorageLocation!
  addedAt: DateTime!
  updatedAt: DateTime!
}

input PantryItemInput {
  name: String!
  quantity: Float!
  unit: String!
  categoryId: ID!
  expiryDate: Date
  location: StorageLocation!
}

enum StorageLocation {
  PANTRY
  FRIDGE
  FREEZER
}
```

---

## 11. Security Architecture

### 11.1 Security Layers

```mermaid
graph TB
    subgraph "Security Perimeter"
        WAF[Web Application Firewall]
        DDoS[DDoS Protection]
    end
    
    subgraph "Application Security"
        Auth[Authentication<br/>OAuth 2.0 / JWT]
        Authz[Authorization<br/>RBAC]
        Encryption[Encryption<br/>TLS 1.3]
    end
    
    subgraph "Data Security"
        Encrypt[Encryption at Rest<br/>AES-256]
        Backup[Encrypted Backups]
        Audit[Audit Logging]
    end
    
    Internet --> WAF
    WAF --> DDoS
    DDoS --> Auth
    Auth --> Authz
    Authz --> Encryption
    Encryption --> Encrypt
    Encrypt --> Backup
    Backup --> Audit
```

### 11.2 Security Implementation

```javascript
// Security Middleware
class SecurityMiddleware {
  // Rate Limiting
  rateLimiter() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP'
    });
  }
  
  // Input Validation
  validateInput(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Invalid input',
          details: error.details
        });
      }
      next();
    };
  }
  
  // JWT Authentication
  authenticate() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }
  
  // RBAC Authorization
  authorize(roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    };
  }
  
  // Data Encryption
  encryptSensitiveData(data) {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
}
```

### 11.3 Security Checklist

- [ ] HTTPS everywhere (TLS 1.3)
- [ ] OAuth 2.0 / JWT authentication
- [ ] Role-based access control (RBAC)
- [ ] Input validation & sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (CSP headers)
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] API key rotation
- [ ] Secrets management (AWS Secrets Manager)
- [ ] Security headers (HSTS, X-Frame-Options)
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] PII data encryption
- [ ] GDPR/CCPA compliance

---

## 12. Infrastructure & Deployment

### 12.1 Container Architecture

```dockerfile
# Multi-stage Dockerfile for Node.js service
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```

### 12.2 Kubernetes Deployment

```yaml
# Kubernetes Deployment Configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inventory-service
  labels:
    app: inventory-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: inventory-service
  template:
    metadata:
      labels:
        app: inventory-service
    spec:
      containers:
      - name: inventory-service
        image: pantryapp/inventory-service:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: inventory-service
spec:
  selector:
    app: inventory-service
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: inventory-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: inventory-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 12.3 Infrastructure as Code (Terraform)

```hcl
# Terraform Configuration for AWS
provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "pantry-app-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
  enable_dns_hostnames = true
}

# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "pantry-app-cluster"
  cluster_version = "1.27"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  node_groups = {
    main = {
      desired_capacity = 3
      max_capacity     = 10
      min_capacity     = 3
      
      instance_types = ["t3.medium"]
      
      k8s_labels = {
        Environment = "production"
      }
    }
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier = "pantry-app-db"
  
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  storage_type         = "gp3"
  storage_encrypted    = true
  
  db_name  = "pantrydb"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  deletion_protection = true
  skip_final_snapshot = false
}

# S3 Bucket for receipts
resource "aws_s3_bucket" "receipts" {
  bucket = "pantry-app-receipts"
  
  tags = {
    Name        = "Receipt Storage"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_versioning" "receipts" {
  bucket = aws_s3_bucket.receipts.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "receipts" {
  bucket = aws_s3_bucket.receipts.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

---

## 13. Performance & Scalability

### 13.1 Performance Optimization Strategies

| Layer | Optimization | Impact |
|-------|-------------|--------|
| **Frontend** | Code splitting, lazy loading | 40% faster initial load |
| **API** | Response caching, pagination | 60% reduction in response time |
| **Database** | Query optimization, indexing | 50% faster queries |
| **Infrastructure** | CDN, edge caching | 70% reduction in latency |
| **OCR Pipeline** | Parallel processing, queue optimization | 3x throughput increase |

### 13.2 Caching Strategy

```javascript
// Multi-layer Caching Implementation
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.redisClient = redis.createClient();
    this.cdnCache = new CDNCache();
  }
  
  async get(key, options = {}) {
    // L1: Memory cache (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // L2: Redis cache
    const redisValue = await this.redisClient.get(key);
    if (redisValue) {
      this.memoryCache.set(key, redisValue);
      return redisValue;
    }
    
    // L3: Database
    const dbValue = await this.fetchFromDatabase(key);
    if (dbValue) {
      await this.set(key, dbValue, options);
      return dbValue;
    }
    
    return null;
  }
  
  async set(key, value, options = {}) {
    const ttl = options.ttl || 3600;
    
    // Set in all cache layers
    this.memoryCache.set(key, value);
    await this.redisClient.setex(key, ttl, JSON.stringify(value));
    
    if (options.cdn) {
      await this.cdnCache.set(key, value, ttl);
    }
  }
}
```

### 13.3 Load Testing & Performance Metrics

```yaml
# K6 Load Testing Script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
  },
};

export default function() {
  // Test pantry items endpoint
  let response = http.get('https://api.pantryapp.com/v1/pantry/items');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## 14. Monitoring & Observability

### 14.1 Observability Stack

```mermaid
graph TB
    subgraph "Application"
        App[Application<br/>OpenTelemetry SDK]
    end
    
    subgraph "Collection"
        Collector[OpenTelemetry Collector]
    end
    
    subgraph "Storage & Analysis"
        Prometheus[Prometheus<br/>Metrics]
        Loki[Loki<br/>Logs]
        Tempo[Tempo<br/>Traces]
    end
    
    subgraph "Visualization"
        Grafana[Grafana<br/>Dashboards]
        Alert[AlertManager]
    end
    
    App --> Collector
    Collector --> Prometheus
    Collector --> Loki
    Collector --> Tempo
    
    Prometheus --> Grafana
    Loki --> Grafana
    Tempo --> Grafana
    
    Prometheus --> Alert
```

### 14.2 Logging & Tracing

```javascript
// Structured Logging with Correlation IDs
class Logger {
  constructor() {
    this.winston = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
      ]
    });
  }
  
  log(level, message, meta = {}) {
    const correlationId = meta.correlationId || uuid();
    
    this.winston.log({
      level,
      message,
      ...meta,
      correlationId,
      service: process.env.SERVICE_NAME,
      timestamp: new Date().toISOString()
    });
  }
}

// Distributed Tracing
const { trace } = require('@opentelemetry/api');
const tracer = trace.getTracer('pantry-app');

async function processReceipt(receiptId) {
  const span = tracer.startSpan('process-receipt');
  span.setAttributes({
    'receipt.id': receiptId,
    'service.name': 'ocr-service'
  });
  
  try {
    // Process receipt
    const result = await ocrPipeline.process(receiptId);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
```

### 14.3 Metrics & Alerts

```yaml
# Prometheus Alert Rules
groups:
  - name: pantry_app_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5% for 5 minutes"
      
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow response times"
          description: "95th percentile response time is above 500ms"
      
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Container memory usage is above 90%"
```

---

## 15. Development Workflow

### 15.1 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
  
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          docker build -t pantryapp/${{ matrix.service }}:${{ github.sha }} .
          docker tag pantryapp/${{ matrix.service }}:${{ github.sha }} pantryapp/${{ matrix.service }}:latest
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push pantryapp/${{ matrix.service }}:${{ github.sha }}
          docker push pantryapp/${{ matrix.service }}:latest
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/${{ matrix.service }} \
            ${{ matrix.service }}=pantryapp/${{ matrix.service }}:${{ github.sha }} \
            --namespace=production
```

### 15.2 Development Environment

```docker-compose
# docker-compose.yml for local development
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pantrydb
      POSTGRES_USER: pantryuser
      POSTGRES_PASSWORD: pantrypass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
  
  inventory-service:
    build:
      context: ./services/inventory
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/inventory:/app
      - /app/node_modules
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://pantryuser:pantrypass@postgres:5432/pantrydb
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://admin:admin@rabbitmq:5672
    depends_on:
      - postgres
      - redis
      - rabbitmq
  
  ocr-service:
    build:
      context: ./services/ocr
      dockerfile: Dockerfile.dev
    volumes:
      - ./services/ocr:/app
    ports:
      - "3002:3000"
    environment:
      RABBITMQ_URL: amqp://admin:admin@rabbitmq:5672
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - rabbitmq

volumes:
  postgres_data:
```

---

## 16. Architecture Decision Records

### ADR-001: Microservices Architecture

**Status:** Accepted  
**Date:** 2025-09-01

**Context:** Need to build a scalable, maintainable system that can evolve independently.

**Decision:** Adopt microservices architecture with domain-driven design.

**Consequences:**
- ✅ Independent scaling and deployment
- ✅ Technology diversity possible
- ❌ Increased operational complexity
- ❌ Network latency between services

### ADR-002: PWA with Offline-First

**Status:** Accepted  
**Date:** 2025-09-01

**Context:** Target users need reliable access regardless of network conditions.

**Decision:** Build as Progressive Web App with offline-first architecture.

**Consequences:**
- ✅ Works offline
- ✅ No app store deployment needed
- ✅ Cross-platform compatibility
- ❌ Limited device API access
- ❌ Complex sync logic required

### ADR-003: Serverless OCR Pipeline

**Status:** Accepted  
**Date:** 2025-09-01

**Context:** OCR processing has variable load and needs to scale efficiently.

**Decision:** Use serverless architecture (AWS Lambda) for OCR pipeline.

**Consequences:**
- ✅ Auto-scaling based on demand
- ✅ Cost-effective for variable loads
- ✅ No server management
- ❌ Cold start latency
- ❌ 15-minute execution limit

### ADR-004: CRDT for Conflict Resolution

**Status:** Accepted  
**Date:** 2025-09-01

**Context:** Multiple devices can modify same data while offline.

**Decision:** Use Conflict-free Replicated Data Types (CRDT) for sync.

**Consequences:**
- ✅ Automatic conflict resolution
- ✅ Eventually consistent
- ✅ No central coordination needed
- ❌ Complex implementation
- ❌ Larger data overhead

---

## Appendices

### A. Technology Stack Summary

| Category | Technology | Purpose |
|----------|------------|---------|
| Frontend Framework | React/Next.js | UI development |
| State Management | Zustand | Client state |
| Offline Storage | IndexedDB | Local data persistence |
| Service Worker | Workbox | PWA capabilities |
| Backend Runtime | Node.js | API services |
| ML Runtime | Python | OCR & AI services |
| Primary Database | PostgreSQL | Relational data |
| Cache | Redis | Session & query cache |
| Message Queue | RabbitMQ/SQS | Async processing |
| Object Storage | S3 | Images & files |
| Container | Docker | Application packaging |
| Orchestration | Kubernetes | Container management |
| CI/CD | GitHub Actions | Automation |
| Monitoring | Prometheus/Grafana | Observability |
| Cloud Provider | AWS/GCP | Infrastructure |

### B. API Rate Limits

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| GET /api/pantry/* | 100 req | 1 min |
| POST /api/pantry/* | 50 req | 1 min |
| POST /api/receipts/scan | 10 req | 1 min |
| POST /api/recipes/recommend | 20 req | 1 min |
| WebSocket connections | 5 conn | Per user |

### C. Database Indexes

```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_pantry_items_household_expiry 
  ON pantry_items(household_id, expiry_date);

CREATE INDEX CONCURRENTLY idx_pantry_items_category_location 
  ON pantry_items(category_id, location);

CREATE INDEX CONCURRENTLY idx_receipts_household_date 
  ON receipts(household_id, purchase_date DESC);

CREATE INDEX CONCURRENTLY idx_items_barcode 
  ON items(barcode) WHERE barcode IS NOT NULL;

-- Full-text search indexes
CREATE INDEX idx_items_name_gin 
  ON items USING gin(to_tsvector('english', name));
```

### D. Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| ERR_AUTH_001 | Invalid credentials | 401 |
| ERR_AUTH_002 | Token expired | 401 |
| ERR_AUTH_003 | Insufficient permissions | 403 |
| ERR_PANTRY_001 | Item not found | 404 |
| ERR_PANTRY_002 | Duplicate item | 409 |
| ERR_OCR_001 | Invalid image format | 400 |
| ERR_OCR_002 | Processing failed | 500 |
| ERR_SYNC_001 | Conflict detected | 409 |
| ERR_SYNC_002 | Sync failed | 503 |

---

## Document Control

**Review Schedule:** Quarterly  
**Next Review:** December 2025  
**Approval:** CTO, Lead Architect  
**Distribution:** Engineering Team, DevOps Team

**Version History:**
- v1.0.0 - Initial architecture document
- v1.1.0 - Added OCR pipeline details
- v1.2.0 - Enhanced security section

---

## 17. Disaster Recovery & Business Continuity

### 17.1 Backup Strategy

```yaml
# Backup Configuration
backups:
  postgresql:
    type: automated
    frequency: daily
    retention:
      daily: 7
      weekly: 4
      monthly: 12
    replication:
      type: streaming
      standby_regions: [us-west-2, eu-west-1]
    point_in_time_recovery: enabled
    
  s3_objects:
    type: versioning
    lifecycle:
      current_version: 90_days
      previous_versions: 30_days
    cross_region_replication:
      enabled: true
      destination: us-west-2
      
  redis:
    type: snapshot
    frequency: hourly
    persistence:
      aof: enabled
      rdb: enabled
```

### 17.2 Disaster Recovery Plan

```mermaid
graph LR
    subgraph "Primary Region (us-east-1)"
        Primary[Primary Database]
        PrimaryApp[Application Servers]
        PrimaryCache[Redis Primary]
    end
    
    subgraph "DR Region (us-west-2)"
        Standby[Standby Database]
        StandbyApp[Standby Servers<br/>Scale: 0]
        StandbyCache[Redis Replica]
    end
    
    Primary -->|Streaming Replication| Standby
    PrimaryCache -->|Async Replication| StandbyCache
    
    subgraph "Failover Process"
        Detect[Detect Failure]
        Promote[Promote Standby]
        Scale[Scale Applications]
        DNS[Update DNS]
    end
    
    Detect --> Promote
    Promote --> Scale
    Scale --> DNS
```

### 17.3 Recovery Procedures

```bash
#!/bin/bash
# Automated Failover Script

# 1. Health Check
check_primary_health() {
    response=$(curl -s -o /dev/null -w "%{http_code}" https://api.pantryapp.com/health)
    if [ $response -ne 200 ]; then
        initiate_failover
    fi
}

# 2. Failover Execution
initiate_failover() {
    echo "Initiating failover to DR region..."
    
    # Promote standby database
    aws rds promote-read-replica \
        --db-instance-identifier pantry-db-standby \
        --region us-west-2
    
    # Scale up standby applications
    kubectl scale deployment --all \
        --replicas=3 \
        --namespace=production \
        --context=eks-us-west-2
    
    # Update Route53 DNS
    aws route53 change-resource-record-sets \
        --hosted-zone-id Z123456789 \
        --change-batch file://failover-dns.json
    
    # Notify operations team
    send_alert "Failover completed to us-west-2"
}

# RTO: 15 minutes | RPO: 1 minute
```

---

## 18. Testing Strategy

### 18.1 Test Architecture

```typescript
// Test Structure
tests/
├── unit/              # Unit tests
│   ├── services/
│   ├── components/
│   └── utils/
├── integration/       # Integration tests
│   ├── api/
│   ├── database/
│   └── external/
├── e2e/              # End-to-end tests
│   ├── user-flows/
│   ├── critical-paths/
│   └── offline-scenarios/
├── performance/      # Performance tests
│   ├── load/
│   ├── stress/
│   └── spike/
├── security/         # Security tests
│   ├── penetration/
│   └── vulnerability/
└── fixtures/         # Test data
```

### 18.2 Testing Implementation

```javascript
// Unit Test Example
describe('PantryItemService', () => {
  let service;
  let mockRepository;
  
  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn()
    };
    service = new PantryItemService(mockRepository);
  });
  
  describe('addItem', () => {
    it('should add item with expiry date calculation', async () => {
      const item = {
        name: 'Milk',
        category: 'dairy',
        defaultExpiryDays: 7
      };
      
      mockRepository.save.mockResolvedValue({ id: '123', ...item });
      
      const result = await service.addItem(item);
      
      expect(result.expiryDate).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Milk',
          expiryDate: expect.any(Date)
        })
      );
    });
  });
});

// Integration Test Example
describe('OCR Pipeline Integration', () => {
  it('should process receipt end-to-end', async () => {
    const receiptImage = await loadFixture('receipt-sample.jpg');
    
    // Upload receipt
    const uploadResponse = await request(app)
      .post('/api/receipts/scan')
      .attach('file', receiptImage)
      .expect(202);
    
    const { jobId } = uploadResponse.body;
    
    // Wait for processing
    await waitForJobCompletion(jobId, { timeout: 10000 });
    
    // Verify results
    const resultResponse = await request(app)
      .get(`/api/receipts/${jobId}`)
      .expect(200);
    
    expect(resultResponse.body).toMatchObject({
      status: 'completed',
      items: expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String)
        })
      ])
    });
  });
});

// E2E Test with Playwright
test('Complete offline shopping flow', async ({ page }) => {
  // Go offline
  await page.context().setOffline(true);
  
  // Add items while offline
  await page.goto('/pantry');
  await page.click('[data-testid="add-item"]');
  await page.fill('[name="itemName"]', 'Bread');
  await page.fill('[name="quantity"]', '2');
  await page.click('[type="submit"]');
  
  // Verify item appears locally
  await expect(page.locator('[data-testid="pantry-item"]')).toContainText('Bread');
  
  // Go back online
  await page.context().setOffline(false);
  
  // Wait for sync
  await page.waitForSelector('[data-testid="sync-complete"]');
  
  // Verify item synced to server
  const response = await page.request.get('/api/pantry/items');
  const items = await response.json();
  expect(items).toContainEqual(
    expect.objectContaining({ name: 'Bread' })
  );
});
```

### 18.3 Performance Testing

```javascript
// K6 Performance Test Script
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    // Smoke test
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
    // Load test
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 100 },
        { duration: '10m', target: 100 },
        { duration: '5m', target: 0 },
      ],
    },
    // Stress test
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '10m', target: 0 },
      ],
    },
    // Spike test
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '10s', target: 1000 },
        { duration: '3m', target: 1000 },
        { duration: '10s', target: 100 },
        { duration: '3m', target: 100 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.1'],
  },
};

export default function () {
  const payload = JSON.stringify({
    name: 'Test Item',
    quantity: Math.random() * 10,
    category: 'test',
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.API_TOKEN}`,
    },
  };
  
  const response = http.post(
    'https://api.pantryapp.com/v1/pantry/items',
    payload,
    params
  );
  
  const success = check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  errorRate.add(!success);
  sleep(1);
}
```

---

## 19. Data Migration Strategy

### 19.1 Migration Pipeline

```python
# Data Migration Framework
class DataMigrationPipeline:
    def __init__(self, source_db, target_db):
        self.source = source_db
        self.target = target_db
        self.batch_size = 1000
        self.checkpoint_manager = CheckpointManager()
        
    async def migrate(self, table_name: str):
        """
        Migrate data with zero downtime using dual-write pattern
        """
        # Phase 1: Dual write (new + old)
        await self.enable_dual_write(table_name)
        
        # Phase 2: Backfill historical data
        await self.backfill_data(table_name)
        
        # Phase 3: Verification
        await self.verify_data_integrity(table_name)
        
        # Phase 4: Switch reads to new database
        await self.switch_reads(table_name)
        
        # Phase 5: Stop writes to old database
        await self.disable_old_writes(table_name)
        
    async def backfill_data(self, table_name: str):
        last_checkpoint = self.checkpoint_manager.get_checkpoint(table_name)
        
        query = f"""
            SELECT * FROM {table_name}
            WHERE id > %s
            ORDER BY id
            LIMIT %s
        """
        
        while True:
            # Fetch batch
            rows = await self.source.fetch(
                query, 
                last_checkpoint, 
                self.batch_size
            )
            
            if not rows:
                break
                
            # Transform if needed
            transformed_rows = self.transform_data(rows, table_name)
            
            # Insert into target
            await self.target.insert_batch(table_name, transformed_rows)
            
            # Update checkpoint
            last_checkpoint = rows[-1]['id']
            self.checkpoint_manager.save_checkpoint(
                table_name, 
                last_checkpoint
            )
            
            # Rate limiting to avoid overload
            await asyncio.sleep(0.1)
    
    def transform_data(self, rows: List[Dict], table_name: str) -> List[Dict]:
        """Apply any necessary data transformations"""
        transformers = {
            'users': self.transform_users,
            'pantry_items': self.transform_pantry_items,
            'receipts': self.transform_receipts
        }
        
        transformer = transformers.get(table_name, lambda x: x)
        return [transformer(row) for row in rows]
```

### 19.2 Schema Evolution

```sql
-- Version Control for Database Migrations
CREATE TABLE schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER,
    checksum VARCHAR(64)
);

-- Migration: Add nutrition tracking
-- Version: 2025_09_15_001
BEGIN;

-- Add nutrition data to items
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS nutrition_per_100g JSONB;

-- Create nutrition summary table
CREATE TABLE IF NOT EXISTS nutrition_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id),
    date DATE NOT NULL,
    calories DECIMAL(10,2),
    protein_g DECIMAL(10,2),
    carbs_g DECIMAL(10,2),
    fat_g DECIMAL(10,2),
    fiber_g DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(household_id, date)
);

-- Backfill nutrition data
UPDATE items i
SET nutrition_per_100g = n.data
FROM nutrition_database n
WHERE i.barcode = n.barcode
  AND i.nutrition_per_100g IS NULL;

-- Record migration
INSERT INTO schema_migrations (version, checksum)
VALUES ('2025_09_15_001', SHA256('nutrition_tracking_v1'));

COMMIT;
```

---

## 20. API Gateway Configuration

### 20.1 Gateway Architecture

```yaml
# Kong API Gateway Configuration
_format_version: "2.1"

services:
  - name: inventory-service
    url: http://inventory-service.default.svc.cluster.local
    routes:
      - name: inventory-routes
        paths:
          - /api/v1/pantry
        strip_path: false
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          policy: local
      - name: request-transformer
        config:
          add:
            headers:
              - X-Service-Name:inventory
      - name: cors
        config:
          origins:
            - https://pantryapp.com
            - http://localhost:3000
          credentials: true
          
  - name: ocr-service
    url: http://ocr-service.default.svc.cluster.local
    routes:
      - name: ocr-routes
        paths:
          - /api/v1/receipts
        strip_path: false
    plugins:
      - name: rate-limiting
        config:
          minute: 20
          policy: local
      - name: request-size-limiting
        config:
          allowed_payload_size: 10
          
  - name: recipe-service
    url: http://recipe-service.default.svc.cluster.local
    routes:
      - name: recipe-routes
        paths:
          - /api/v1/recipes
        strip_path: false
    plugins:
      - name: rate-limiting
        config:
          minute: 50
          policy: local
      - name: response-transformer
        config:
          add:
            headers:
              - Cache-Control:public, max-age=3600

plugins:
  - name: jwt
    config:
      key_claim_name: kid
      secret_is_base64: false
      anonymous: null
  - name: prometheus
    config:
      per_consumer: true
```

### 20.2 Circuit Breaker Implementation

```javascript
// Circuit Breaker for Service Calls
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    
    this.state = 'CLOSED';
    this.failures = 0;
    this.nextAttempt = Date.now();
    this.successCount = 0;
    this.failureCount = 0;
  }
  
  async call(asyncFunction, ...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await asyncFunction(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
    
    this.successCount++;
  }
  
  onFailure() {
    this.failures++;
    this.failureCount++;
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      
      // Log and alert
      logger.error('Circuit breaker opened', {
        service: this.serviceName,
        failures: this.failures,
        resetAt: new Date(this.nextAttempt)
      });
    }
  }
  
  getMetrics() {
    return {
      state: this.state,
      successCount: this.successCount,
      failureCount: this.failureCount,
      failureRate: this.failureCount / (this.successCount + this.failureCount),
      nextAttempt: this.nextAttempt
    };
  }
}

// Usage
const inventoryServiceBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000
});

async function getInventoryItems(householdId) {
  return inventoryServiceBreaker.call(async () => {
    const response = await fetch(`/api/inventory/items?household=${householdId}`);
    if (!response.ok) throw new Error('Service unavailable');
    return response.json();
  });
}
```

---

## 21. Cost Optimization

### 21.1 Resource Optimization Strategy

```yaml
# Cost Optimization Configuration
cost_optimization:
  compute:
    # Use Spot Instances for non-critical workloads
    spot_instances:
      enabled: true
      services:
        - ocr-workers
        - batch-processors
      max_price: 0.03  # per hour
      
    # Auto-scaling policies
    autoscaling:
      scale_down_cooldown: 300
      scale_up_cooldown: 60
      target_cpu_utilization: 70
      
    # Reserved Instances for baseline load
    reserved_instances:
      type: standard
      term: 1_year
      payment: partial_upfront
      count: 3
      
  storage:
    # S3 Lifecycle policies
    s3_lifecycle:
      receipts:
        transition_to_ia: 30  # days
        transition_to_glacier: 90
        expiration: 365
        
    # Database optimization
    database:
      read_replicas:
        auto_pause: true
        min_capacity: 0.5
        max_capacity: 1
        
  networking:
    # CDN for static assets
    cloudfront:
      price_class: PriceClass_100  # Use only cheapest regions
      compress: true
      cache_behaviors:
        - path: /static/*
          ttl: 86400
        - path: /api/*
          ttl: 0
```

### 21.2 Cost Monitoring

```python
# Cost Tracking and Alerting
class CostMonitor:
    def __init__(self):
        self.aws_client = boto3.client('ce')  # Cost Explorer
        self.alert_threshold = 1000  # USD per day
        
    async def analyze_daily_costs(self):
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=1)
        
        response = self.aws_client.get_cost_and_usage(
            TimePeriod={
                'Start': start_date.isoformat(),
                'End': end_date.isoformat()
            },
            Granularity='DAILY',
            Metrics=['UnblendedCost'],
            GroupBy=[
                {'Type': 'DIMENSION', 'Key': 'SERVICE'},
                {'Type': 'TAG', 'Key': 'Environment'}
            ]
        )
        
        total_cost = 0
        cost_breakdown = {}
        
        for group in response['ResultsByTime'][0]['Groups']:
            service = group['Keys'][0]
            cost = float(group['Metrics']['UnblendedCost']['Amount'])
            cost_breakdown[service] = cost
            total_cost += cost
        
        # Alert if over threshold
        if total_cost > self.alert_threshold:
            await self.send_cost_alert(total_cost, cost_breakdown)
        
        # Identify optimization opportunities
        optimizations = self.identify_optimizations(cost_breakdown)
        
        return {
            'date': start_date,
            'total_cost': total_cost,
            'breakdown': cost_breakdown,
            'optimizations': optimizations
        }
    
    def identify_optimizations(self, cost_breakdown):
        optimizations = []
        
        # Check for underutilized resources
        if cost_breakdown.get('Amazon EC2', 0) > 500:
            optimizations.append({
                'service': 'EC2',
                'recommendation': 'Consider using Spot Instances or downsizing',
                'potential_savings': '30-70%'
            })
        
        # Check for unattached EBS volumes
        if cost_breakdown.get('Amazon EBS', 0) > 100:
            optimizations.append({
                'service': 'EBS',
                'recommendation': 'Review and delete unattached volumes',
                'potential_savings': '20-30%'
            })
        
        return optimizations
```

---

## 22. Operational Procedures

### 22.1 Deployment Checklist

```markdown
## Production Deployment Checklist

### Pre-Deployment
- [ ] Code review completed and approved
- [ ] All tests passing (unit, integration, e2e)
- [ ] Security scan completed (no critical vulnerabilities)
- [ ] Performance testing completed
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented
- [ ] Change advisory board approval

### Deployment Steps
- [ ] Create deployment tag in git
- [ ] Build and push Docker images
- [ ] Update Kubernetes manifests
- [ ] Apply database migrations
- [ ] Deploy to canary environment (5% traffic)
- [ ] Monitor canary metrics for 30 minutes
- [ ] Gradual rollout (25% -> 50% -> 100%)
- [ ] Verify all health checks passing
- [ ] Update documentation

### Post-Deployment
- [ ] Monitor error rates for 2 hours
- [ ] Check performance metrics
- [ ] Verify all integrations working
- [ ] Update status page
- [ ] Send deployment notification
- [ ] Schedule retrospective if issues occurred
```

### 22.2 Incident Response

```yaml
# Incident Response Playbook
incident_response:
  severity_levels:
    P1:
      description: "Complete service outage"
      response_time: 5_minutes
      escalation: immediate
      team: [on_call_engineer, team_lead, cto]
      
    P2:
      description: "Significant degradation"
      response_time: 15_minutes
      escalation: 30_minutes
      team: [on_call_engineer, team_lead]
      
    P3:
      description: "Minor issue"
      response_time: 1_hour
      escalation: 4_hours
      team: [on_call_engineer]
      
  runbook:
    steps:
      1_detect:
        - Check monitoring dashboards
        - Verify alerts are accurate
        - Determine severity level
        
      2_respond:
        - Acknowledge incident in PagerDuty
        - Create incident channel in Slack
        - Start incident timeline document
        
      3_mitigate:
        - Apply immediate fixes if known
        - Consider rollback if recent deployment
        - Scale resources if capacity issue
        
      4_investigate:
        - Review logs and metrics
        - Check recent changes
        - Identify root cause
        
      5_resolve:
        - Apply permanent fix
        - Verify resolution
        - Monitor for recurrence
        
      6_postmortem:
        - Document timeline
        - Identify root cause
        - Create action items
        - Share learnings
```

### 22.3 Monitoring Dashboard Configuration

```json
{
  "dashboard": {
    "title": "Pantry App Operations Dashboard",
    "panels": [
      {
        "title": "API Response Time (p95)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(active_websocket_connections)"
          }
        ]
      },
      {
        "title": "OCR Processing Queue",
        "type": "gauge",
        "targets": [
          {
            "expr": "rabbitmq_queue_messages{queue=\"ocr_processing\"}"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "pg_stat_activity_count",
            "legendFormat": "{{datname}}"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m]))"
          }
        ]
      }
    ]
  }
}
```

---

## 23. Compliance & Governance

### 23.1 Data Privacy Compliance

```typescript
// GDPR Compliance Implementation
class PrivacyCompliance {
  // Right to Access
  async exportUserData(userId: string): Promise<UserDataExport> {
    const data = {
      profile: await this.getUserProfile(userId),
      pantryItems: await this.getUserPantryItems(userId),
      receipts: await this.getUserReceipts(userId),
      activityLog: await this.getUserActivityLog(userId)
    };
    
    return this.formatForExport(data);
  }
  
  // Right to Erasure
  async deleteUserData(userId: string): Promise<void> {
    // Soft delete with retention for legal requirements
    await this.db.transaction(async (trx) => {
      // Anonymize personal data
      await trx('users')
        .where('id', userId)
        .update({
          email: `deleted_${userId}@deleted.com`,
          name: 'Deleted User',
          phone: null,
          deleted_at: new Date()
        });
      
      // Delete pantry items
      await trx('pantry_items')
        .where('user_id', userId)
        .delete();
      
      // Delete receipts after extracting required tax data
      const receipts = await trx('receipts')
        .where('user_id', userId)
        .select('id', 'total_amount', 'purchase_date');
      
      // Archive for tax compliance (7 years)
      await trx('archived_transactions').insert(
        receipts.map(r => ({
          user_id: 'anonymous',
          amount: r.total_amount,
          date: r.purchase_date,
          archived_at: new Date()
        }))
      );
      
      await trx('receipts')
        .where('user_id', userId)
        .delete();
    });
    
    // Log deletion for compliance
    await this.auditLog.log({
      action: 'USER_DATA_DELETED',
      userId,
      timestamp: new Date(),
      reason: 'User requested deletion'
    });
  }
  
  // Consent Management
  async updateConsent(userId: string, consents: ConsentUpdate): Promise<void> {
    await this.db('user_consents').insert({
      user_id: userId,
      marketing_emails: consents.marketing,
      analytics: consents.analytics,
      third_party_sharing: consents.thirdParty,
      updated_at: new Date(),
      ip_address: consents.ipAddress
    });
  }
}
```

### 23.2 Audit Logging

```python
# Comprehensive Audit Logging
class AuditLogger:
    def __init__(self):
        self.logger = self._setup_logger()
        
    def log_event(self, event_type: str, **kwargs):
        """Log security-relevant events for compliance"""
        
        audit_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'event_type': event_type,
            'user_id': kwargs.get('user_id'),
            'ip_address': kwargs.get('ip_address'),
            'user_agent': kwargs.get('user_agent'),
            'resource': kwargs.get('resource'),
            'action': kwargs.get('action'),
            'result': kwargs.get('result'),
            'metadata': kwargs.get('metadata', {})
        }
        
        # Log to secure audit trail (immutable)
        self._write_to_audit_trail(audit_entry)
        
        # Send to SIEM if configured
        if self.siem_enabled:
            self._send_to_siem(audit_entry)
        
        # Check for suspicious patterns
        self._analyze_for_threats(audit_entry)
    
    def _analyze_for_threats(self, entry):
        """Detect potential security threats"""
        
        # Multiple failed login attempts
        if entry['event_type'] == 'LOGIN_FAILED':
            recent_failures = self._get_recent_failures(
                entry['ip_address'], 
                minutes=10
            )
            if len(recent_failures) > 5:
                self._trigger_alert('BRUTE_FORCE_ATTEMPT', entry)
        
        # Unusual access patterns
        if entry['event_type'] == 'DATA_ACCESS':
            if self._is_unusual_access_pattern(entry):
                self._trigger_alert('UNUSUAL_ACCESS_PATTERN', entry)
```

---

## 24. Future Enhancements Roadmap

### 24.1 Technical Roadmap

```mermaid
gantt
    title Technical Enhancement Roadmap
    dateFormat  YYYY-MM-DD
    
    section Phase 1 - Q4 2025
    ML Model Improvements     :2025-10-01, 30d
    GraphQL Migration         :2025-10-15, 45d
    WebAssembly OCR          :2025-11-01, 30d
    
    section Phase 2 - Q1 2026
    Blockchain Receipts       :2026-01-01, 60d
    AR Pantry Visualization   :2026-01-15, 45d
    Voice Assistant           :2026-02-01, 30d
    
    section Phase 3 - Q2 2026
    Edge Computing            :2026-04-01, 60d
    Federated Learning        :2026-04-15, 75d
    IoT Integration           :2026-05-01, 45d
```

### 24.2 Architecture Evolution

```yaml
future_architecture:
  edge_computing:
    description: "Process OCR at edge for faster response"
    benefits:
      - Reduced latency (<1s processing)
      - Lower bandwidth usage
      - Enhanced privacy
    implementation:
      - Deploy edge functions to CDN nodes
      - Use WebAssembly for OCR
      - Cache ML models at edge
      
  blockchain_integration:
    description: "Immutable receipt storage"
    benefits:
      - Tamper-proof records
      - Decentralized verification
      - Tax compliance automation
    implementation:
      - Smart contracts for receipt validation
      - IPFS for receipt storage
      - Ethereum L2 for transactions
      
  ai_enhancements:
    federated_learning:
      description: "Train models on user devices"
      benefits:
        - Enhanced privacy
        - Personalized models
        - Reduced server costs
        
    computer_vision_v2:
      description: "Advanced food recognition"
      benefits:
        - Identify food without receipts
        - Freshness detection
        - Portion size estimation
        
  iot_integration:
    smart_fridge:
      - Real-time inventory updates
      - Automatic expiry tracking
      - Temperature monitoring
      
    smart_scales:
      - Precise quantity tracking
      - Nutritional calculations
      - Waste measurement
```

---

## Appendix E: Glossary of Terms

| Term | Definition |
|------|------------|
| **CRDT** | Conflict-free Replicated Data Type - Data structure for automatic conflict resolution |
| **PWA** | Progressive Web Application - Web app with native-like capabilities |
| **OCR** | Optical Character Recognition - Converting images to text |
| **Service Worker** | JavaScript running in background for offline functionality |
| **IndexedDB** | Browser-based NoSQL database for client-side storage |
| **JWT** | JSON Web Token - Secure token for authentication |
| **WebSocket** | Protocol for real-time bidirectional communication |
| **Circuit Breaker** | Pattern to prevent cascading failures |
| **Event Sourcing** | Storing state changes as sequence of events |
| **CQRS** | Command Query Responsibility Segregation |
| **RTO** | Recovery Time Objective - Maximum acceptable downtime |
| **RPO** | Recovery Point Objective - Maximum acceptable data loss |
| **SLA** | Service Level Agreement - Uptime guarantee |
| **RBAC** | Role-Based Access Control |
| **SIEM** | Security Information and Event Management |

---

## Appendix F: Reference Architecture Diagrams

### F.1 Complete System Architecture

[Due to space constraints, detailed architecture diagrams would be provided as separate files]

### F.2 Network Topology

[Network diagrams showing VPC, subnets, and security groups]

### F.3 Data Flow Diagrams

[Detailed data flow for each major feature]

---

## Document Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CTO | | | |
| Lead Architect | | | |
| Security Officer | | | |
| DevOps Lead | | | |
| QA Lead | | | |

---

*This architecture document is a living document and will evolve as the system grows and requirements change.*