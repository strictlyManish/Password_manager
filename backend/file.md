Here's a complete authentication middleware setup for your Node.js + Express backend:

middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; // adjust import path

/
 * Protect routes - require authentication
 * Verifies JWT token and attaches user to request
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check cookies (optional, if you use httpOnly cookies)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found - token invalid',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired - please login again',
      });
    }
    next(error);
  }
};

/
 * Optional auth - doesn't fail if no token, but attaches user if present
 * Useful for routes that show different content for logged-in users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }

    next();
  } catch (error) {
    // Silently fail - continue without user
    next();
  }
};

/
 * Authorize - check user roles
 * Must be used after protect middleware
 * @param  {...string} roles - allowed roles (e.g., 'admin', 'user')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: Role '${req.user.role}' is not authorized to access this resource,
      });
    }

    next();
  };
};

/
 * Check if user owns the resource
 * Useful for CRUD operations on user-specific resources
 */
export const isOwner = (resourceParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if the resource belongs to the user
    const resource = req[resourceParam] || req.params[resourceParam];
    
    if (resource && resource.userId && resource.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    next();
  };
};

middleware/errorMiddleware.js

/
 * Global error handler middleware
 * Place this last in your middleware chain
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: ${field} already exists,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/
 * 404 handler for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(Route not found - ${req.originalUrl});
  res.status(404);
  next(error);
};

middleware/validate.js (Optional request validation)

/
 * Request validation middleware using a schema validator
 * Works with Joi, Zod, or express-validator
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    next();
  };
};

middleware/rateLimiter.js (Optional security)

import rateLimit from 'express-rate-limit';

/
 * Rate limiter for auth routes to prevent brute force
 */
export const authLimiter = rateLimit({
  windowMs: 15  60  1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
});

Usage Example in Routes

// routes/authRoutes.js
import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (with rate limiting)
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Admin-only route
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;

Update app.js / server.js

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

// Core middleware
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/vault', vaultRoutes);

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;

Key Features:

protect - Secures routes, requires valid JWT
optionalAuth - Gracefully handles missing tokens
authorize - Role-based access control
errorHandler - Centralized error handling with dev/prod modes
authLimiter - Prevents brute force attacks on auth endpoints
Cookie support - Works with both Bearer tokens and httpOnly cookies

Make sure to install required packages:
npm install jsonwebtoken express-rate-limit cookie-parser

And add to your .env:
JWTSECRET=yoursupersecretkey_here
JWT_EXPIRE=7d
NODE_ENV=development