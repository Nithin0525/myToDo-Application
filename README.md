# Advanced Todo App with Full-Stack Features

A comprehensive full-stack web application for managing todo lists with advanced features, built with React, Node.js, Express, and MongoDB. This app includes enterprise-level features like rate limiting, comprehensive validation, error handling, and enhanced user experience.

## Recent Updates (Latest Version)

### Security Enhancements
- **Email-Password Validation**: Prevents users from using the same value for email and password during registration
- **Case-Insensitive Validation**: Email and password comparison is case-insensitive for better security
- **Real-time Validation**: Frontend validation updates immediately when email or password changes
- **Backend Security**: Server-side validation prevents bypassing frontend checks

### Code Cleanup
- **Removed Test Files**: Cleaned up all test and debug files for production
- **Removed IDE Settings**: Eliminated .vscode and .idea directories
- **Removed System Files**: Cleaned up .DS_Store and other system files
- **Optimized Structure**: Streamlined project structure for better maintenance
- **Removed Debug Logs**: Cleaned up unnecessary console.log statements

### Validation Improvements
- **Enhanced Password Validation**: Added email-password match prevention
- **Cross-field Validation**: Password field re-validates when email changes
- **Clear Error Messages**: User-friendly validation feedback
- **Comprehensive Backend Validation**: Joi schema validation with custom rules

## Features

### Authentication & Security
- **JWT Authentication**: Secure login/register with token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: XSS protection and data validation
- **CORS Protection**: Secure cross-origin requests
- **Email-Password Validation**: Prevents using email as password

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
- **Email**: Valid format, common domain validation (Gmail, Yahoo, Hotmail, Outlook)
- **Password**: 8+ characters, uppercase, lowercase, number, special character
- **Email-Password Match**: Password cannot be the same as email address
- **Todo Title**: 1-255 characters, required
- **Description**: Optional, max 1000 characters
- **Tags**: Max 10 tags, 20 characters each

### Error Handling
- **Validation Errors**: Detailed field-specific messages
- **Authentication Errors**: Clear login/register feedback
- **Network Errors**: Graceful handling of connection issues
- **Server Errors**: User-friendly error messages

## Deployment

### Backend Deployment - Render

1. **Create render.yaml file** in `todo-app/backend/`:
```yaml
services:
  - type: web
    name: todo-app-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5001
      - key: MONGO_URI
        value: mongodb+srv://username:password@cluster.mongodb.net/todo-app
      - key: JWT_SECRET
        value: your_super_secret_jwt_key_here
```

2. **Deploy to Render**:
   - Connect your GitHub repository to Render
   - Render will automatically detect the render.yaml file
   - Set environment variables in Render dashboard
   - Deploy automatically on git push

### Frontend Deployment - Netlify

1. **Build the frontend**:
```bash
cd todo-app/frontend
npm run build
```

2. **Manual Deployment**:
   - Go to Netlify dashboard
   - Drag and drop the `build` folder from `todo-app/frontend/build/`
   - Netlify will automatically deploy your site
   - Set custom domain if needed

3. **Environment Variables**:
   - Set `REACT_APP_API_URL` to your Render backend URL
   - Example: `https://your-backend-name.onrender.com`

### Environment Configuration

**Backend Environment Variables**:
```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
JWT_SECRET=your_super_secret_jwt_key_here
```

**Frontend Environment Variables**:
```env
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

### Deployment URLs
- **Backend**: `https://your-backend-name.onrender.com`
- **Frontend**: `https://your-site-name.netlify.app`

## Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Email-Password Validation**: Prevents using email as password
- **Rate Limiting**: Protection against brute force attacks
- **Input Sanitization**: XSS and injection protection

### Data Validation
- **Frontend Validation**: Real-time user feedback
- **Backend Validation**: Server-side security
- **Schema Validation**: Joi validation for all inputs
- **Error Handling**: Secure error messages

## Testing

### Manual Testing Checklist
- User registration and login
- Email-password validation
- Todo CRUD operations
- Search and filtering
- Bulk actions
- Error handling
- Rate limiting
- Input validation
- Responsive design
- Dark mode functionality

### Security Testing
- Email-password match prevention
- Rate limiting effectiveness
- Input validation bypass attempts
- Authentication token security
- XSS protection testing

## Project Structure

```
todo-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── app.js
│   ├── server.js
│   ├── render.yaml
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── build/
│   └── package.json
└── README.md
```

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
- Ensure security best practices

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Built with modern web technologies for a comprehensive todo management experience.

---

**Status**: Production Ready with Enterprise Features

**Last Updated**: January 2025

**Version**: 2.1.0 - Enhanced Security with Email-Password Validation 