import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateUsername = (username) => {
    if (!username.trim()) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    if (!/^[a-zA-Z]/.test(username)) return 'Username must start with a letter';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    // Only allow Gmail, Yahoo, and Hotmail domains
    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    
    if (!domain || !allowedDomains.includes(domain)) {
      return 'Please use Gmail, Yahoo, or Hotmail email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    setMessage('');
    
    // Real-time validation
    let fieldError = '';
    switch (name) {
      case 'username':
        fieldError = validateUsername(value);
        break;
      case 'email':
        fieldError = validateEmail(value);
        break;
      case 'password':
        fieldError = validatePassword(value);
        // Also validate confirm password when password changes
        if (formData.confirmPassword) {
          setValidationErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword)
          }));
        }
        break;
      case 'confirmPassword':
        fieldError = validateConfirmPassword(value);
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validate = () => {
    const errors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };
    
    setValidationErrors(errors);
    
    const hasErrors = Object.values(errors).some(error => error !== '');
    return hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setError('Please fix the validation errors above');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setMessage(res.data.message);
      setError('');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setValidationErrors({});
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else if (err.response?.status === 429) {
        setError('Too many attempts. Please wait a moment and try again.');
      } else {
        setError('Registration failed. Please check your details and try again.');
      }
      setMessage('');
    }
    setLoading(false);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'text-muted', text: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    const strengthMap = {
      0: { color: 'text-muted', text: '' },
      1: { color: 'text-danger', text: 'Very Weak' },
      2: { color: 'text-warning', text: 'Weak' },
      3: { color: 'text-info', text: 'Fair' },
      4: { color: 'text-primary', text: 'Good' },
      5: { color: 'text-success', text: 'Strong' }
    };
    
    return { strength: score, ...strengthMap[score] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100" style={{ 
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
      
      <div className="card shadow-lg p-5" style={{ 
        maxWidth: 450, 
        width: '100%', 
        borderRadius: '20px', 
        border: 'none',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="text-center mb-4">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <i className="fas fa-user-plus text-white" style={{ fontSize: '2rem' }}></i>
          </div>
          <h2 className="mb-2" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700',
            fontSize: '2.2rem'
          }}>Create Account</h2>
          <p className="text-muted">Join us and start organizing your life</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: '#667eea', fontSize: '0.9rem' }}>
              <i className="fas fa-user me-2"></i>Username
            </label>
            <div className="position-relative">
              <input
                type="text"
                name="username"
                className={`form-control ${validationErrors.username ? 'is-invalid' : ''}`}
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Enter your username"
                style={{ 
                  borderRadius: '12px', 
                  border: '2px solid #e8e8e8',
                  padding: '15px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f8f9fa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.background = '#f8f9fa';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {validationErrors.username && <div className="invalid-feedback">{validationErrors.username}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: '#667eea', fontSize: '0.9rem' }}>
              <i className="fas fa-envelope me-2"></i>Email Address
            </label>
            <div className="position-relative">
              <input
                type="email"
                name="email"
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter Gmail, Yahoo, or Hotmail email"
                style={{ 
                  borderRadius: '12px', 
                  border: '2px solid #e8e8e8',
                  padding: '15px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f8f9fa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.background = '#f8f9fa';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: '#667eea', fontSize: '0.9rem' }}>
              <i className="fas fa-lock me-2"></i>Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Enter your password"
                style={{ 
                  borderRadius: '12px 0 0 12px', 
                  border: '2px solid #e8e8e8',
                  padding: '15px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f8f9fa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.background = '#f8f9fa';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                className="btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  borderRadius: '0 12px 12px 0',
                  background: '#f8f9fa',
                  border: '2px solid #e8e8e8',
                  borderLeft: 'none',
                  color: '#667eea',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.color = '#667eea';
                }}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {validationErrors.password && <div className="invalid-feedback">{validationErrors.password}</div>}
            {formData.password && (
              <div className="mt-2">
                <div className="progress" style={{ height: '5px' }}>
                  <div
                    className={`progress-bar ${passwordStrength.color.replace('text-', 'bg-')}`} 
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  ></div>
                </div>
                <small className={passwordStrength.color}>{passwordStrength.text}</small>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: '#667eea', fontSize: '0.9rem' }}>
              <i className="fas fa-shield-alt me-2"></i>Confirm Password
            </label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Confirm your password"
                style={{ 
                  borderRadius: '12px 0 0 12px', 
                  border: '2px solid #e8e8e8',
                  padding: '15px 20px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  background: '#f8f9fa'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e8e8';
                  e.target.style.background = '#f8f9fa';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                className="btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ 
                  borderRadius: '0 12px 12px 0',
                  background: '#f8f9fa',
                  border: '2px solid #e8e8e8',
                  borderLeft: 'none',
                  color: '#667eea',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f8f9fa';
                  e.target.style.color = '#667eea';
                }}
              >
                <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {validationErrors.confirmPassword && <div className="invalid-feedback">{validationErrors.confirmPassword}</div>}
          </div>
          <button 
            type="submit" 
            className="btn w-100 fw-bold" 
            disabled={loading} 
            style={{ 
              borderRadius: '12px', 
              padding: '15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin me-2"></i>Creating Account...
              </span>
            ) : (
              <span>
                <i className="fas fa-user-plus me-2"></i>Create Account
              </span>
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            Already have an account? 
            <a href="/login" className="text-decoration-none fw-bold ms-1" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
