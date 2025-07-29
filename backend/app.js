



const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');

// Import middleware
const { 
  generalLimiter, 
  authLimiter, 
  userLimiter, 
  todoCreationLimiter,
  rateLimitStatus 
} = require('./middleware/rateLimiter');
const { sanitize } = require('./middleware/validation');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(xss());

// ✅ Configure CORS to allow frontend on any port
app.use(cors({
  origin: true, // Allow all origins temporarily
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitize);

// Test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Health check endpoint (before rate limiting)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Todo App API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rate limiting (after health check)
app.use('/api/', generalLimiter);
app.use('/api/login', authLimiter);
// Remove strict rate limiting for registration to allow testing
// app.use('/api/register', authLimiter);
app.use('/api/todos', userLimiter);
app.use('/api/todos', todoCreationLimiter);

// Rate limit status headers
app.use('/api/', rateLimitStatus);

// Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const adminRoutes = require('./routes/admin');

app.use('/api', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
