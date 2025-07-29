// Test the registration validation
const testData = {
  username: 'testuser123',
  email: 'test123@example.com',
  password: 'TestPass123!'
};

// Frontend validation functions (copied from Register.js)
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

console.log('Testing registration validation...');
console.log('Username validation:', validateUsername(testData.username));
console.log('Email validation:', validateEmail(testData.email));
console.log('Password validation:', validatePassword(testData.password));

// Test with different data
console.log('\nTesting with different data:');
const testData2 = {
  username: 'testuser123',
  email: 'test123@gmail.com', // Using gmail.com which should be valid
  password: 'TestPass123!'
};

console.log('Username validation:', validateUsername(testData2.username));
console.log('Email validation:', validateEmail(testData2.email));
console.log('Password validation:', validatePassword(testData2.password)); 