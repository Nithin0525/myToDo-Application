const Joi = require('joi');

// User registration validation schema
const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 20 characters long',
      'string.pattern.base': 'Username must start with a letter and contain only letters, numbers, and underscores',
      'any.required': 'Username is required'
    }),
  email: Joi.string()
    .email()
    .custom((value, helpers) => {
      const domain = value.split('@')[1]?.toLowerCase();
      const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      
      if (!domain || !allowedDomains.includes(domain)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
      'any.invalid': 'Please use Gmail, Yahoo, or Hotmail email address'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    })
});

// User login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .custom((value, helpers) => {
      const domain = value.split('@')[1]?.toLowerCase();
      const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      
      if (!domain || !allowedDomains.includes(domain)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
      'any.invalid': 'Please use Gmail, Yahoo, or Hotmail email address'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Todo creation validation schema
const todoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .trim()
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title must be at most 255 characters long',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Description must be at most 1000 characters long'
    }),
  completed: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Completed must be a boolean value'
    }),
  dueDate: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Due date cannot be in the past'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be low, medium, or high'
    }),
  reminder: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Reminder cannot be in the past'
    }),
  tags: Joi.array()
    .items(Joi.string().trim().max(20))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed',
      'string.max': 'Tag must be at most 20 characters long'
    })
});

// Todo update validation schema (all fields optional)
const todoUpdateSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(255)
    .trim()
    .optional()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title must be at most 255 characters long'
    }),
  description: Joi.string()
    .max(1000)
    .trim()
    .optional()
    .messages({
      'string.max': 'Description must be at most 1000 characters long'
    }),
  completed: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Completed must be a boolean value'
    }),
  dueDate: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Due date cannot be in the past'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional()
    .messages({
      'any.only': 'Priority must be low, medium, or high'
    }),
  reminder: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Reminder cannot be in the past'
    }),
  tags: Joi.array()
    .items(Joi.string().trim().max(20))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 tags allowed',
      'string.max': 'Tag must be at most 20 characters long'
    })
});

// Profile update validation schema
const profileSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/)
    .optional()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must be at most 20 characters long',
      'string.pattern.base': 'Username must start with a letter and contain only letters, numbers, and underscores'
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please enter a valid email address'
    })
});

// Validation middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      // Return a simple error message that the frontend can handle
      const firstError = error.details[0];
      return res.status(400).json({
        message: firstError.message
      });
    }
    next();
  };
};

// Sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags
  input = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags and their content
  input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove potentially dangerous characters
  input = input.replace(/[<>]/g, '');
  
  // Trim whitespace
  input = input.trim();
  
  return input;
};

// Sanitization middleware
const sanitize = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

module.exports = {
  validate,
  sanitize,
  registerSchema,
  loginSchema,
  todoSchema,
  todoUpdateSchema,
  profileSchema
}; 