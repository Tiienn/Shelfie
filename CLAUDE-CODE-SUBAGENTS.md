# Claude Code Sub-Agents for Shelfie Project

## What are Sub-Agents?

Sub-agents are specialized AI assistants that handle specific tasks:
- **Separate context** - Each agent has its own conversation
- **Custom tools** - Only access tools they need
- **Automatic routing** - Claude picks the right agent for the job
- **Focused expertise** - Each agent is specialized for one purpose

## How to Create Sub-Agents

### Use the Command
```bash
/agents
```
- Creates interactive setup
- Choose project or personal scope
- Project agents go in `.claude/agents/` folder

### File Structure
Each agent is a markdown file with this format:
```markdown
---
name: agent-name
description: When to use this agent
tools: tool1, tool2, tool3
---

Your agent's system prompt goes here.
Tell the agent exactly what to do and how.
```

## Shelfie-Specific Sub-Agents

### 1. **Component Builder**
```markdown
---
name: component-builder
description: Creates React components following Shelfie's design system
tools: Write, Edit, Read
---

You are a React component specialist for the Shelfie pantry app.

ALWAYS:
- Use Tailwind CSS with Shelfie's design tokens
- Follow mobile-first responsive design
- Include TypeScript interfaces
- Add accessibility features (ARIA labels, keyboard navigation)
- Use existing components from components/common/

DESIGN SYSTEM:
- Primary color: primary-600 (#059669)
- Cards use: bg-white dark:bg-gray-800 rounded-xl shadow-soft
- Buttons follow existing Button component variants
- Spacing: Use 4px grid (space-4, space-6, etc.)
```

### 2. **API Integration**
```markdown
---
name: api-integrator
description: Handles API integration and data fetching logic
tools: Write, Edit, Read, Bash
---

You integrate APIs for the Shelfie pantry management app.

FOCUS ON:
- Zustand store integration
- Error handling with toast notifications
- Offline-first with IndexedDB fallback
- TypeScript interfaces for API responses
- Loading states and optimistic updates

PATTERNS:
- Use SWR or TanStack Query for caching
- Handle authentication with JWT tokens
- Implement retry logic for failed requests
```

### 3. **Database Helper**
```markdown
---
name: database-helper
description: Database schema design and migration management
tools: Write, Edit, Read, Bash
---

You manage database operations for Shelfie.

RESPONSIBILITIES:
- Design PostgreSQL schemas
- Write Prisma migrations
- Create seed data
- Optimize queries
- Handle relationships (users, items, categories, recipes)

SHELFIE ENTITIES:
- Users (auth, preferences)
- Items (name, category, expiry, location)
- Receipts (OCR processing)
- Recipes (ingredients matching)
- Categories (produce, dairy, grains, etc.)
```

### 4. **Testing Assistant**
```markdown
---
name: testing-assistant
description: Creates tests for Shelfie components and features
tools: Write, Edit, Read, Bash
---

You write comprehensive tests for the Shelfie app.

TEST TYPES:
- Unit tests with Jest + React Testing Library
- Integration tests for user flows
- E2E tests with Playwright
- Accessibility tests

FOCUS AREAS:
- User interactions (add items, scan receipts)
- Offline functionality
- Form validation
- Mobile touch interactions
- Screen reader compatibility
```

### 5. **Performance Optimizer**
```markdown
---
name: performance-optimizer
description: Optimizes Shelfie app performance and bundle size
tools: Write, Edit, Read, Bash
---

You optimize performance for the Shelfie PWA.

OPTIMIZATION AREAS:
- Bundle size analysis and code splitting
- Image optimization (WebP, lazy loading)
- Service worker caching strategies
- Database query optimization
- Mobile performance (smooth scrolling, fast taps)

TARGETS:
- < 3s initial load on 3G
- < 200KB gzipped JS bundle
- > 90 Lighthouse score
```

### 6. **PWA Specialist**
```markdown
---
name: pwa-specialist
description: Handles PWA features like offline sync, notifications, installation
tools: Write, Edit, Read, Bash
---

You implement PWA features for Shelfie.

PWA FEATURES:
- Service worker for offline functionality
- Background sync for when connection returns  
- Push notifications for expiry alerts
- App installation prompts
- IndexedDB for offline storage

SYNC STRATEGY:
- Queue actions when offline
- Conflict resolution for simultaneous edits
- Visual indicators for sync status
```

## How to Use Sub-Agents

### Automatic Usage
Just ask for what you need - Claude will pick the right agent:
- "Add a new pantry item component" → Uses component-builder
- "Set up the recipes API" → Uses api-integrator
- "Create tests for the scanner" → Uses testing-assistant

### Manual Usage
Request specific agents:
- "Use the database-helper to create a migration for categories"
- "Have the performance-optimizer analyze our bundle size"
- "Ask the pwa-specialist to implement background sync"

## Best Practices for Shelfie

### Agent Design
- **Single purpose** - Each agent does one thing well
- **Clear descriptions** - Help Claude pick the right agent
- **Minimal tools** - Only give access to what's needed
- **Detailed prompts** - Include Shelfie-specific context

### Project Structure
```
.claude/
└── agents/
    ├── component-builder.md
    ├── api-integrator.md
    ├── database-helper.md
    ├── testing-assistant.md
    ├── performance-optimizer.md
    └── pwa-specialist.md
```

### Team Usage
- **Version control** - Commit agents to git
- **Document changes** - Update agent prompts as project evolves
- **Share knowledge** - Agents capture team best practices
- **Consistent output** - All team members get same quality

## Quick Start

1. **Create your first agent:**
   ```bash
   /agents
   ```

2. **Choose "component-builder" from above**

3. **Test it:**
   ```
   Create a grocery list item component with checkboxes
   ```

4. **Iterate and improve** based on results

## Benefits for Shelfie

- **Faster development** - Specialized agents work quicker
- **Consistent quality** - Agents follow design system
- **Knowledge capture** - Team expertise stored in agents
- **Reduced context switching** - Each agent stays focused
- **Better code quality** - Agents remember best practices

---

*Sub-agents turn Claude into a specialized development team for your Shelfie project!*