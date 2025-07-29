# Advanced Todo App with Full-Stack Features

A comprehensive full-stack web application for managing todo lists with advanced features, built with React, Node.js, Express, and MongoDB. This app includes enterprise-level features like rate limiting, comprehensive validation, error handling, and enhanced user experience.

## Features

### Authentication & Security
- **JWT Authentication**: Secure login/register with token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: XSS protection and data validation
- **CORS Protection**: Secure cross-origin requests

### Todo Management
- **CRUD Operations**: Create, read, update, delete todos
- **Rich Descriptions**: Multi-line text with proper Enter key support
- **Due Dates**: Set and track deadlines
- **Priority Levels**: Low, medium, high priority
- **Tags System**: Categorize todos with custom tags
- **Reminders**: Set reminder dates for important tasks
- **Bulk Actions**: Complete/delete multiple todos at once

### Advanced Search & Filter
- **Real-time Search**: Search by title and description
- **Status Filtering**: Filter by completed/pending status
- **Sorting Options**: Sort by date, title, priority
- **Pagination**: Handle large datasets efficiently
- **Show/Hide Completed**: Toggle completed todos visibility

### User Experience
- **Responsive Design**: Mobile-first Bootstrap UI
- **Dark Mode**: Toggle between light and dark themes
- **Todo Templates**: Quick setup with predefined templates
- **Export/Import**: Backup and restore your todos
- **Undo Delete**: 5-second window to restore deleted todos
- **Progress Tracking**: Visual completion statistics
- **Keyboard Shortcuts**: Enhanced productivity

### Error Handling & Validation
- **Comprehensive Validation**: Frontend and backend validation
- **Custom Error Classes**: Detailed error messages
- **Global Error Handling**: Consistent error responses
- **Input Validation**: Username, email, password requirements
- **Real-time Feedback**: Success and error notifications

## Tech Stack

### Frontend
- **React 18**: Modern functional components with hooks
- **Bootstrap 5**: Responsive UI framework
- **Axios**: HTTP client with interceptors
- **Context API**: Global state management
- **Local Storage**: Persistent user sessions

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework with middleware
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Joi**: Schema validation
- **express-rate-limit**: Rate limiting protection
- **helmet**: Security headers

### Database Schema
```javascript
// User Schema
{
  username: String (3-20 chars, alphanumeric),
  email: String (valid email format),
  password: String (hashed with bcrypt),
  createdAt: Date
}

// Todo Schema
{
  user: ObjectId (reference to User),
  title: String (1-255 chars),
  description: String (optional, max 1000 chars),
  completed: Boolean (default: false),
  dueDate: Date (optional),
  priority: String (low/medium/high),
  reminder: Date (optional),
  tags: [String] (max 10 tags),
  createdAt: Date,
  updatedAt: Date
}
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd todo-app/backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# or
node server.js
```

### Frontend Setup
```bash
cd todo-app/frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration with validation
- `POST /api/login` - User login with JWT response

### Todos (Protected Routes)
- `GET /api/todos` - Get user's todos with pagination, search, filtering
- `POST /api/todos` - Create new todo with validation
- `PUT /api/todos/:id` - Update todo (partial updates supported)
- `DELETE /api/todos/:id` - Delete todo with confirmation

### Query Parameters
- `?page=1` - Pagination page number
- `?limit=10` - Items per page
- `?search=keyword` - Search in title/description
- `?status=completed` - Filter by status
- `?sortBy=createdAt` - Sort field
- `?sortOrder=desc` - Sort direction

## Usage Guide

### 1. Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Use your credentials to access your todo list
3. **Dashboard**: View your todos with search and filter options

### 2. Creating Todos
- **Basic Todo**: Enter title and optional description
- **Advanced Todo**: Add due date, priority, tags, and reminders
- **Templates**: Use predefined templates for quick setup
- **Multi-line**: Press Enter in description for new lines

### 3. Managing Todos
- **Edit**: Click "Edit" to modify todo details
- **Complete**: Click the circle (○) to mark as complete (✓)
- **Delete**: Click "×" to delete (undo available for 5 seconds)
- **Bulk Actions**: Select multiple todos for batch operations

### 4. Organization
- **Search**: Find todos by title or description
- **Filter**: Show only completed or pending todos
- **Sort**: Arrange by date, title, or priority
- **Tags**: Categorize todos for better organization

## Advanced Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Todo Creation**: 10 todos per minute per user
- **User-specific**: 50 requests per 10 minutes per user

### Validation Rules
- **Username**: 3-20 characters, alphanumeric + underscore, starts with letter
- **Email**: Valid format, common domain validation
- **Password**: 8+ characters, uppercase, lowercase, number, special character
- **Todo Title**: 1-255 characters, required
- **Description**: Optional, max 1000 characters
- **Tags**: Max 10 tags, 20 characters each

### Error Handling
- **Validation Errors**: Detailed field-specific messages
- **Authentication Errors**: Clear login/register feedback
- **Network Errors**: Graceful handling of connection issues
- **Server Errors**: User-friendly error messages

## Deployment

### Environment Variables
```env
# Production
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
JWT_SECRET=your_super_secret_jwt_key_here
```

### Backend Deployment (Heroku/Railway)
```bash
cd todo-app/backend
# Set environment variables in your hosting platform
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd todo-app/frontend
npm run build
# Deploy the build folder
```

## Testing

### Backend API Tests
```bash
cd todo-app/backend
node test-features.js
```

### Manual Testing Checklist
- User registration and login
- Todo CRUD operations
- Search and filtering
- Bulk actions
- Error handling
- Rate limiting
- Input validation
- Responsive design

## Screenshots & Features

### Core Features
- **Authentication**: Secure login/register system
- **Todo Management**: Full CRUD with advanced features
- **Search & Filter**: Real-time search with multiple filters
- **Bulk Operations**: Multi-select and batch actions
- **Responsive Design**: Works on all devices

### Advanced Features
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management
- **Export/Import**: Data portability
- **Templates**: Quick todo setup
- **Dark Mode**: Theme customization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Test on multiple devices

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Built with modern web technologies for a comprehensive todo management experience.

---

**Status**: Production Ready with Enterprise Features

**Last Updated**: July 2025

**Version**: 2.0.0 - Enhanced with Advanced Features 