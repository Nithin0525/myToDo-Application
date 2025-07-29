import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStats();
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadStats = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/admin/users?page=${currentPage}&search=${searchTerm}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      loadUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        loadUsers(); // Refresh the list
        loadStats(); // Refresh stats
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="fas fa-tachometer-alt me-2"></i>
        Admin Dashboard
      </h2>

      {/* Statistics Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-users me-2"></i>
                  Total Users
                </h5>
                <h2 className="mb-0">{stats.totalUsers}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-tasks me-2"></i>
                  Total Todos
                </h5>
                <h2 className="mb-0">{stats.totalTodos}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-check-circle me-2"></i>
                  Completed
                </h5>
                <h2 className="mb-0">{stats.completedTodos}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-percentage me-2"></i>
                  Completion Rate
                </h5>
                <h2 className="mb-0">{stats.completionRate}%</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h4 className="mb-0">
            <i className="fas fa-users-cog me-2"></i>
            User Management
          </h4>
        </div>
        <div className="card-body">
          {/* Search Bar */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <select
                          className="form-select form-select-sm"
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          style={{ width: 'auto' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => deleteUser(user._id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 