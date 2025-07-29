import React, { useState } from 'react';
import Signin from './Signin';
import Register from './Register';
import TodoApp from './TodoApp';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('signin'); // 'signin' or 'register'

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // If logged in, show TodoApp
  if (isLoggedIn) {
    return <TodoApp />;
  }

  // Show appropriate page based on currentPage state
  if (currentPage === 'register') {
    return <Register onSwitchToSignin={() => setCurrentPage('signin')} />;
  }

  return <Signin onSwitchToRegister={() => setCurrentPage('register')} />;
}

export default App;
