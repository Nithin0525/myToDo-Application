import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import TodoApp from './TodoApp';

function App() {
  const [currentPage, setCurrentPage] = useState('register');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // If logged in, show TodoApp
  if (isLoggedIn) {
    return <TodoApp />;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setCurrentPage('register')}
          style={{ 
            marginRight: '10px', 
            padding: '10px 20px',
            backgroundColor: currentPage === 'register' ? '#007bff' : '#f8f9fa',
            color: currentPage === 'register' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
        <button 
          onClick={() => setCurrentPage('login')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: currentPage === 'login' ? '#007bff' : '#f8f9fa',
            color: currentPage === 'login' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
      
      {currentPage === 'register' ? <Register /> : <Login />}
    </div>
  );
}

export default App;
