// Debug the frontend validation logic
const testCases = [
  {
    username: 'testuser123',
    email: 'test123@example.com',
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!'
  },
  {
    username: 'user',
    email: 'user@gmail.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  },
  {
    username: '1user', // starts with number - should fail
    email: 'user@gmail.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
  },
  {
    username: 'user',
    email: 'invalid-email', // invalid email
    password: 'Password123!',
    confirmPassword: 'Password123!'
  },
  {
    username: 'user',
    email: 'user@gmail.com',
    password: 'weak', // weak password
    confirmPassword: 'weak'
  }
];

// Frontend validation functions
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
  
  // More flexible domain validation - allow any valid domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain || domain.length < 3) {
    return 'Please enter a valid email domain';
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

const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (confirmPassword !== password) return 'Passwords do not match';
  return '';
};

console.log('Testing frontend validation logic...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}:`);
  console.log('Input:', testCase);
  
  const usernameError = validateUsername(testCase.username);
  const emailError = validateEmail(testCase.email);
  const passwordError = validatePassword(testCase.password);
  const confirmPasswordError = validateConfirmPassword(testCase.confirmPassword, testCase.password);
  
  console.log('Username validation:', usernameError || '✅ Valid');
  console.log('Email validation:', emailError || '✅ Valid');
  console.log('Password validation:', passwordError || '✅ Valid');
  console.log('Confirm password validation:', confirmPasswordError || '✅ Valid');
  
  const hasErrors = [usernameError, emailError, passwordError, confirmPasswordError].some(error => error !== '');
  console.log('Overall result:', hasErrors ? '❌ Has validation errors' : '✅ All valid');
  console.log('---\n');
}); 