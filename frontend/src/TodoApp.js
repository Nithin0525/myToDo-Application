import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_CONFIG from './config';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editTodo, setEditTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deletedTodo, setDeletedTodo] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  
  // Dynamic features
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, title, priority
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [showCompleted, setShowCompleted] = useState(true);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isEditingTodo, setIsEditingTodo] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Get token and username from localStorage
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'User';

  // Configure axios with auth header - get fresh token on each request
  const api = axios.create({
    baseURL: API_CONFIG.BASE_URL
  });

  // Add request interceptor to include fresh token
  api.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/todos');
      // Handle new API response format with pagination
      if (response.data.todos) {
        setTodos(response.data.todos);
      } else {
        // Fallback for old format
        setTodos(response.data);
      }
      setLoading(false);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
      setLoading(false);
    }
  };

  const refreshTodos = async () => {
    setTodos([]);
    setError('');
    setSuccess('');
    await fetchTodos();
  };

  // Dynamic filtering and sorting
  const getFilteredAndSortedTodos = () => {
    let filtered = todos;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    // Show/hide completed
    if (!showCompleted) {
      filtered = filtered.filter(todo => !todo.completed);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const addTodo = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newTodo.title.trim()) {
      setError('Title is required');
      return;
    }
    if (newTodo.title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }
    
    setIsAddingTodo(true);
    try {
      const response = await api.post('/todos', newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '' });
      setSuccess('Todo added successfully! 🎉');
      
      // Animate the new todo
      setTimeout(() => {
        const newTodoElement = document.querySelector(`[data-todo-id="${response.data._id}"]`);
        if (newTodoElement) {
          newTodoElement.classList.add('todo-added');
        }
      }, 100);
    } catch (err) {
      handleTodoError(err, 'add');
    }
    setIsAddingTodo(false);
  };

  const startEdit = (todo) => {
    setEditTodo({ ...todo });
    setShowModal(true);
    setIsEditingTodo(false);
    setError('');
    setSuccess('');
  };

  const handleEditChange = (e) => {
    setEditTodo({ ...editTodo, [e.target.name]: e.target.value });
  };



  const handleEditDescriptionChange = (e) => {
    const value = e.target.value;
    setEditTodo({ ...editTodo, description: value });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!editTodo.title.trim()) {
      setError('Title is required');
      return;
    }
    if (editTodo.title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }
    try {
      setIsEditingTodo(true);
      const response = await api.put(`/todos/${editTodo._id}`, {
        title: editTodo.title,
        description: editTodo.description
      });
      setTodos(todos.map(todo => todo._id === editTodo._id ? response.data : todo));
      setShowModal(false);
      setEditTodo(null);
      setIsEditingTodo(false);
      setSuccess('Todo updated successfully! ✨');
    } catch (err) {
      setIsEditingTodo(false);
      handleTodoError(err, 'update');
    }
  };

  const toggleTodo = async (id, completed) => {
    setError('');
    setSuccess('');
    try {
      const response = await api.put(`/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setSuccess(completed ? 'Todo marked as incomplete! 🔄' : 'Todo completed! ✅');
    } catch (err) {
      handleTodoError(err, 'toggle');
    }
  };

  const deleteTodo = async (id) => {
    setError('');
    setSuccess('');
    try {
      const todoToDelete = todos.find(todo => todo._id === id);
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      setDeletedTodo(todoToDelete);
      setShowUndo(true);
      setSuccess('Todo deleted! 🗑️');

      // Auto-hide undo after 5 seconds
      setTimeout(() => {
        setShowUndo(false);
        setDeletedTodo(null);
      }, 5000);
    } catch (err) {
      handleTodoError(err, 'delete');
    }
  };

  const undoDelete = async () => {
    if (!deletedTodo) return;
    
    try {
      const response = await api.post('/todos', {
        title: deletedTodo.title,
        description: deletedTodo.description
      });
      setTodos([response.data, ...todos]);
      setShowUndo(false);
      setDeletedTodo(null);
      setSuccess('Todo restored! 🔄');
    } catch (err) {
      setError('Failed to restore todo');
    }
  };

  // Bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedTodos.length === 0) return;
    
    setError('');
    setSuccess('');
    
    try {
      if (bulkAction === 'complete') {
        await Promise.all(selectedTodos.map(id => 
          api.put(`/todos/${id}`, { completed: true })
        ));
        setTodos(todos.map(todo => 
          selectedTodos.includes(todo._id) ? { ...todo, completed: true } : todo
        ));
        setSuccess(`${selectedTodos.length} todos marked as complete! ✅`);
      } else if (bulkAction === 'delete') {
        await Promise.all(selectedTodos.map(id => api.delete(`/todos/${id}`)));
        setTodos(todos.filter(todo => !selectedTodos.includes(todo._id)));
        setSuccess(`${selectedTodos.length} todos deleted! 🗑️`);
      }
      
      setSelectedTodos([]);
      setBulkAction('');
    } catch (err) {
      setError('Failed to perform bulk action');
    }
  };

  const toggleTodoSelection = (id) => {
    setSelectedTodos(prev => 
      prev.includes(id) 
        ? prev.filter(todoId => todoId !== id)
        : [...prev, id]
    );
  };



  const clearSelection = () => {
    setSelectedTodos([]);
  };



  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setNewTodo({ ...newTodo, description: value });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  // Add function to clear stale data and refresh
  const clearStaleData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setTodos([]);
    setError('');
    setSuccess('');
    window.location.reload();
  };

  // Add error boundary for todo operations
  const handleTodoError = (error, operation) => {
    console.error(`${operation} error:`, error);
    if (error.response?.status === 404) {
      setError(`Todo not found. This might be due to stale data. Please refresh the page.`);
      // Optionally clear stale data
      setTimeout(() => {
        clearStaleData();
      }, 3000);
    } else if (error.response?.data?.message) {
      setError(error.response.data.message);
    } else {
      setError(`Failed to ${operation} todo`);
    }
  };

  const formatDescription = (description) => {
    if (!description) return '';
    return description.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={index} className="mb-1"></div>;
      
      // If line starts with "• ", show it as a bullet point
      if (trimmedLine.startsWith('• ')) {
        return (
          <div key={index} className="mb-1">
            <span className="me-2">•</span>
            {trimmedLine.substring(2)}
          </div>
        );
      }
      
      // Otherwise, show as regular text
      return (
        <div key={index} className="mb-1">
          {trimmedLine}
        </div>
      );
    });
  };



  const getRandomEmoji = () => {
    const emojis = ['👋', '🎉', '✨', '🚀', '🌟', '💫', '🎊', '🔥', '💪', '😊'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Calculate statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length,
    progress: todos.length > 0 ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100) : 0
  };

  if (!token) {
    return (
      <div className="container text-center py-5">
        <h2>Please login to view your todos</h2>
      </div>
    );
  }

  if (loading) {
    return <div className="container text-center py-5">Loading...</div>;
  }

  const filteredTodos = getFilteredAndSortedTodos();

  return (
    <div className="container-fluid min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s infinite linear',
        zIndex: 0
      }}></div>
      
      <div className="container py-5" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header with Username Greeting */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div className="text-white">
            <h1 className="mb-3" style={{ 
              fontSize: '3rem',
              fontWeight: '700',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)'
            }}>
              My Todo List
            </h1>
            <p className="mb-0" style={{ fontSize: '1.2rem', opacity: 0.9 }}>
              {getRandomEmoji()} Welcome back, <strong style={{ color: '#fff' }}>{username}!</strong>
            </p>
          </div>
          <div className="d-flex gap-3 mt-4 mt-md-0">
            <button 
              onClick={refreshTodos}
              className="btn"
              title="Refresh todos"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 20px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-sync-alt me-2"></i> Refresh
            </button>
            <button 
              onClick={logout}
              className="btn"
              style={{
                background: 'rgba(220,53,69,0.8)',
                border: '2px solid rgba(220,53,69,0.3)',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 20px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(220,53,69,1)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(220,53,69,0.8)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-sign-out-alt me-2"></i> Logout
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4 g-3">
          <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-3">
            <div className="card bg-primary text-white h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h3 className="mb-2">{stats.total}</h3>
                <p className="mb-0 small">Total Todos</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-3">
            <div className="card bg-success text-white h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h3 className="mb-2">{stats.completed}</h3>
                <p className="mb-0 small">Completed</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-3">
            <div className="card bg-warning text-white h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h3 className="mb-2">{stats.pending}</h3>
                <p className="mb-0 small">Pending</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-3">
            <div className="card bg-info text-white h-100" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <h3 className="mb-2">{stats.progress}%</h3>
                <p className="mb-0 small">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>Overall Progress</span>
              <span>{stats.progress}%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
        {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}
        
        {/* Undo Toast */}
        {showUndo && deletedTodo && (
          <div className="alert alert-warning alert-dismissible fade show d-flex justify-content-between align-items-center">
            <span>Todo "{deletedTodo.title}" was deleted</span>
            <button onClick={undoDelete} className="btn btn-sm btn-outline-warning">
              Undo
            </button>
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="card p-4 mb-4 shadow-sm" style={{ borderRadius: '15px' }}>
          <div className="row g-3">
            <div className="col-lg-5 col-md-12 mb-3">
              <label className="form-label fw-bold">Todo Title</label>
              <input
                type="text"
                placeholder="Enter todo title"
                value={newTodo.title}
                onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                className="form-control fw-bold"
                maxLength={100}
                style={{ borderRadius: '10px', padding: '12px 15px' }}
              />
            </div>
            <div className="col-lg-5 col-md-12 mb-3">
              <label className="form-label fw-bold">Description (Optional)</label>
              <textarea
                placeholder="Enter description"
                value={newTodo.description}
                onChange={handleDescriptionChange}
                className="form-control"
                rows={3}
                style={{ resize: 'vertical', borderRadius: '10px', padding: '12px 15px' }}
              />
            </div>
            <div className="col-lg-2 col-md-12 d-grid">
              <button 
                type="submit" 
                className="btn btn-primary fw-bold" 
                disabled={isAddingTodo}
                style={{ 
                  borderRadius: '10px', 
                  padding: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {isAddingTodo ? (
                  <span><i className="fas fa-spinner fa-spin me-2"></i>Adding...</span>
                ) : (
                  <span><i className="fas fa-plus me-2"></i>Add Todo</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Dynamic Controls */}
        <div className="card p-3 mb-4" style={{ borderRadius: '15px' }}>
          <div className="row g-3">
            <div className="col-lg-3 col-md-6 col-12 mb-2">
              <label className="form-label small fw-bold">Search</label>
              <input
                type="text"
                placeholder="Search todos..."
                className="form-control"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ borderRadius: '10px', padding: '10px 15px' }}
              />
            </div>
            <div className="col-lg-2 col-md-6 col-6 mb-2">
              <label className="form-label small fw-bold">Status</label>
              <select 
                className="form-select" 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                style={{ borderRadius: '10px', padding: '10px 15px' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-lg-2 col-md-6 col-6 mb-2">
              <label className="form-label small fw-bold">Sort By</label>
              <select 
                className="form-select" 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                style={{ borderRadius: '10px', padding: '10px 15px' }}
              >
                <option value="createdAt">Date</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="col-lg-2 col-md-6 col-6 mb-2">
              <label className="form-label small fw-bold">Order</label>
              <select 
                className="form-select" 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)}
                style={{ borderRadius: '10px', padding: '10px 15px' }}
              >
                <option value="desc">Newest</option>
                <option value="asc">Oldest</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6 col-6 mb-2">
              <div className="form-check d-flex align-items-center h-100">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={showCompleted}
                  onChange={e => setShowCompleted(e.target.checked)}
                  id="showCompleted"
                  style={{ transform: 'scale(1.2)' }}
                />
                <label className="form-check-label small fw-bold" htmlFor="showCompleted">
                  Show Completed
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTodos.length > 0 && (
          <div className="card p-3 mb-4 bg-light" style={{ borderRadius: '15px' }}>
            <div className="row g-3 align-items-center">
              <div className="col-lg-4 col-md-6 col-12">
                <span className="text-muted fw-bold">
                  <i className="fas fa-check-circle me-2"></i>
                  {selectedTodos.length} todo(s) selected
                </span>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <select 
                  className="form-select" 
                  value={bulkAction} 
                  onChange={e => setBulkAction(e.target.value)}
                  style={{ borderRadius: '10px', padding: '10px 15px' }}
                >
                  <option value="">Choose Action</option>
                  <option value="complete">Mark as Complete</option>
                  <option value="delete">Delete Selected</option>
                </select>
              </div>
              <div className="col-lg-4 col-md-12 col-12">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary btn-sm fw-bold" 
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    style={{ 
                      borderRadius: '10px', 
                      padding: '10px 20px',
                      minHeight: '40px'
                    }}
                  >
                    <i className="fas fa-check me-2"></i>Apply
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm fw-bold" 
                    onClick={clearSelection}
                    style={{ 
                      borderRadius: '10px', 
                      padding: '10px 20px',
                      minHeight: '40px'
                    }}
                  >
                    <i className="fas fa-times me-2"></i>Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="row g-3">
          {filteredTodos.length === 0 ? (
            <div className="col-12 text-center text-muted py-5">
              <h4>No todos found! 📝</h4>
              <p>
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Add your first todo above to get started.'
                }
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div className="col-12 col-md-6 col-lg-4" key={todo._id}>
                <div 
                  className={`card shadow-sm h-100 ${todo.completed ? 'bg-light' : ''} ${selectedTodos.includes(todo._id) ? 'border-primary' : ''}`} 
                  style={{ 
                    minHeight: 200,
                    borderRadius: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  data-todo-id={todo._id}
                >
                  <div className="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedTodos.includes(todo._id)}
                            onChange={() => toggleTodoSelection(todo._id)}
                            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                          />
                        </div>
                        <small className="text-muted">
                          <i className="fas fa-calendar-alt me-1"></i>
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <h6 className={`card-title fw-bold mb-2 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                        {todo.title}
                      </h6>
                      {todo.description && (
                        <div className="card-text text-secondary mb-2 small">
                          {formatDescription(todo.description)}
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-end gap-1 mt-3">
                      <button
                        onClick={() => toggleTodo(todo._id, todo.completed)}
                        className={`btn btn-sm ${todo.completed ? 'btn-success' : 'btn-warning'}`}
                        title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        style={{ 
                          borderRadius: '8px', 
                          padding: '8px 12px',
                          minWidth: '40px',
                          minHeight: '40px'
                        }}
                      >
                        {todo.completed ? '✓' : '○'}
                      </button>
                      <button
                        onClick={() => startEdit(todo)}
                        className="btn btn-sm btn-info text-white"
                        title="Edit"
                        style={{ 
                          borderRadius: '8px', 
                          padding: '8px 12px',
                          minWidth: '40px',
                          minHeight: '40px'
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                        style={{ 
                          borderRadius: '8px', 
                          padding: '8px 12px',
                          minWidth: '40px',
                          minHeight: '40px'
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Edit Modal */}
      {showModal && editTodo && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ borderRadius: '15px' }}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Todo</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false);
                    setIsEditingTodo(false);
                  }}
                  style={{ fontSize: '1.2rem' }}
                ></button>
              </div>
              <form onSubmit={saveEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Title</label>
                    <input
                      type="text"
                      name="title" 
                      className="form-control fw-bold" 
                      value={editTodo.title} 
                      onChange={handleEditChange}
                      maxLength={100}
                      style={{ borderRadius: '10px', padding: '12px 15px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea
                      name="description" 
                      className="form-control"
                      value={editTodo.description} 
                      onChange={e => {
                        if (e.target.name === 'description') {
                          handleEditDescriptionChange(e);
                        } else {
                          handleEditChange(e);
                        }
                      }}
                      rows={4}
                      style={{ borderRadius: '10px', padding: '12px 15px', resize: 'vertical' }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                                  <button 
                  type="button" 
                  className="btn btn-secondary fw-bold" 
                  onClick={() => {
                    setShowModal(false);
                    setIsEditingTodo(false);
                  }}
                  style={{ 
                    borderRadius: '10px', 
                    padding: '10px 20px',
                    minHeight: '40px'
                  }}
                >
                  Cancel
                </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary fw-bold"
                    disabled={isEditingTodo}
                    style={{ 
                      borderRadius: '10px', 
                      padding: '10px 20px',
                      minHeight: '40px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    {isEditingTodo ? (
                      <span><i className="fas fa-spinner fa-spin me-2"></i>Saving...</span>
                    ) : (
                      <span><i className="fas fa-save me-2"></i>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoApp; 