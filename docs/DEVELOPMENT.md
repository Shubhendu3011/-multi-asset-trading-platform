# Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose (optional)
- PostgreSQL
- Redis

### Option 1: Local Development

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit the files with your configuration
   ```

3. **Start services**
   ```bash
   # Start PostgreSQL and Redis (if not using Docker)
   # Or use Docker Compose:
   docker-compose up postgres redis -d
   ```

4. **Run the application**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start individually:
   npm run dev:backend
   npm run dev:frontend
   ```

### Option 2: Docker Development

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Nginx Proxy: http://localhost:80

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── tests/               # Test files
├── package.json         # Backend dependencies
└── tsconfig.json        # TypeScript configuration
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service functions
│   ├── utils/           # Utility functions
│   ├── store/           # State management
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── package.json         # Frontend dependencies
└── tsconfig.json        # TypeScript configuration
```

### Shared Structure
```
shared/
├── types/               # Shared TypeScript types
├── constants/           # Shared constants
└── utils/               # Shared utility functions
```

## 🛠 Development Workflow

### 1. Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### 2. Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### 3. Testing
```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend

# Run tests in watch mode
npm run test:watch
```

### 4. Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/trading_platform
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# API Keys
COINGECKO_API_KEY=your_coingecko_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
IEX_CLOUD_API_KEY=your_iex_cloud_api_key

# Server
PORT=3001
NODE_ENV=development

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001

# External Services
REACT_APP_TRADINGVIEW_CHARTING_LIBRARY_URL=your_tradingview_url

# Feature Flags
REACT_APP_ENABLE_CRYPTO_TRADING=true
REACT_APP_ENABLE_STOCK_TRADING=true
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

### Frontend Testing
- **Unit Tests**: Test individual components and hooks
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test user journeys with Cypress

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

## 📊 Database Management

### Migrations
```bash
# Create migration
npm run migration:create -- --name migration_name

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Seeding
```bash
# Seed development data
npm run seed:dev

# Seed test data
npm run seed:test
```

## 🔒 Security Best Practices

### Backend Security
- Validate all input data
- Use parameterized queries
- Implement rate limiting
- Use HTTPS in production
- Sanitize user inputs
- Implement proper authentication

### Frontend Security
- Sanitize user inputs
- Use HTTPS for API calls
- Implement proper error handling
- Don't store sensitive data in localStorage
- Use Content Security Policy

## 🚀 Deployment

### Development Deployment
```bash
# Build for development
npm run build:dev

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Documentation

### API Documentation
- Use OpenAPI/Swagger for API documentation
- Document all endpoints with examples
- Include error responses
- Add authentication requirements

### Code Documentation
- Use JSDoc for function documentation
- Add README files for complex modules
- Document configuration options
- Include setup instructions

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logging
DEBUG=* npm run dev

# Use Node.js debugger
node --inspect backend/src/index.js
```

### Frontend Debugging
```bash
# Enable React DevTools
# Install React Developer Tools browser extension

# Use Redux DevTools
# Install Redux DevTools browser extension
```

## 📈 Performance Monitoring

### Backend Monitoring
- Use Winston for logging
- Implement request/response logging
- Monitor database query performance
- Track API response times

### Frontend Monitoring
- Use React Profiler
- Monitor bundle size
- Track page load times
- Monitor user interactions

## 🔄 Continuous Integration

### GitHub Actions
- Run tests on every push
- Check code quality
- Build and deploy on merge to main
- Security scanning

### Pre-commit Hooks
- Lint code
- Run tests
- Check types
- Format code

---

For more detailed information, see the [API Documentation](./API.md) and [Frontend Guide](./FRONTEND.md). 