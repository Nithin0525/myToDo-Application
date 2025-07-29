const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const authMiddleware = require('../middleware/auth');
const { validate, todoSchema, todoUpdateSchema } = require('../middleware/validation');
const { catchAsync, NotFoundError } = require('../middleware/errorHandler');

// Apply auth middleware to all todo routes
router.use(authMiddleware);

// GET /api/todos - Get all todos for the logged-in user with pagination, search, and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || 'all'; // all, completed, pending
    const sortBy = req.query.sortBy || 'createdAt'; // createdAt, title, updatedAt
    const sortOrder = req.query.sortOrder || 'desc'; // asc, desc
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.' 
      });
    }
    
    // Build query filter
    let query = { user: req.user.userId };
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }
    
    // Build sort object
    let sort = {};
    if (sortBy === 'title') {
      sort.title = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'updatedAt') {
      sort.updatedAt = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }
    
    // Get todos with pagination, search, and filtering
    const todos = await Todo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination info
    const totalTodos = await Todo.countDocuments(query);
    const totalPages = Math.ceil(totalTodos / limit);
    
    res.json({
      todos,
      pagination: {
        currentPage: page,
        totalPages,
        totalTodos,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      filters: {
        search,
        status,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', validate(todoSchema), catchAsync(async (req, res) => {
  const { title, description, dueDate, priority, reminder, tags } = req.body;

    const todo = new Todo({
      user: req.user.userId,
      title,
    description: description || '',
    dueDate: dueDate || null,
    priority: priority || 'medium',
    reminder: reminder || null,
    tags: tags || []
    });

    await todo.save();
    res.status(201).json(todo);
}));

// PUT /api/todos/:id - Update a todo
router.put('/:id', validate(todoUpdateSchema), catchAsync(async (req, res) => {
  const { title, description, completed, dueDate, priority, reminder, tags } = req.body;
    
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.userId });
    
    if (!todo) {
    throw new NotFoundError('Todo');
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  if (priority !== undefined) todo.priority = priority;
  if (reminder !== undefined) todo.reminder = reminder;
  if (tags !== undefined) todo.tags = tags;

    await todo.save();
    res.json(todo);
}));

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', catchAsync(async (req, res) => {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    
    if (!todo) {
    throw new NotFoundError('Todo');
    }

    res.json({ message: 'Todo deleted successfully' });
}));

module.exports = router; 