const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testBackendStatus() {
  console.log('🔍 Testing Backend Status...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const response = await axios.get(`${BASE_URL}/todos`, {
      headers: { 'Authorization': 'Bearer invalid-token' }
    });
    console.log('✅ Server is running');
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log('❌ Server is not running. Please start the backend with: node server.js');
      return;
    }
    console.log('✅ Server is running (got expected auth error)');
  }

  // Test 2: Test registration
  console.log('\n2. Testing registration...');
  try {
    const testUser = {
      username: `testuser${Math.floor(Math.random() * 1000)}`,
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      password: 'TestPass123!'
    };
    
    const registerResponse = await axios.post(`${BASE_URL}/register`, testUser);
    console.log('✅ Registration working:', registerResponse.data.message);
    
    // Test 3: Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: testUser.username,
      password: testUser.password
    });
    console.log('✅ Login working:', loginResponse.data.message);
    
    const token = loginResponse.data.token;
    
    // Test 4: Test todo creation
    console.log('\n4. Testing todo creation...');
    const todoResponse = await axios.post(`${BASE_URL}/todos`, {
      title: 'Test Todo',
      description: 'Test description'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Todo creation working:', todoResponse.data.title);
    
    const todoId = todoResponse.data._id;
    
    // Test 5: Test todo update
    console.log('\n5. Testing todo update...');
    const updateResponse = await axios.put(`${BASE_URL}/todos/${todoId}`, {
      completed: true
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Todo update working:', updateResponse.data.completed);
    
    // Test 6: Test todo deletion
    console.log('\n6. Testing todo deletion...');
    await axios.delete(`${BASE_URL}/todos/${todoId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Todo deletion working');
    
    console.log('\n🎉 All backend tests passed!');
    
  } catch (err) {
    console.log('❌ Test failed:', err.response?.data?.message || err.message);
    console.log('Status:', err.response?.status);
    console.log('Details:', err.response?.data);
  }
}

testBackendStatus(); 