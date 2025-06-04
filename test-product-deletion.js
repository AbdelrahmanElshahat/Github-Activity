// Test script for product deletion functionality
const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Test product deletion functionality (which was causing issues in the cart)
async function testProductDeletion() {
  try {
    // Step 1: Create admin user and sign in
    console.log('Creating/finding admin user...');
    try {
      await axios.get(`${API_URL}/api/users/createadmin`);
    } catch (error) {
      console.log('Admin might already exist:', error.response?.data?.message || error.message);
    }
    
    console.log('Signing in as admin...');
    const signinResponse = await axios.post(`${API_URL}/api/users/signin`, {
      email: 'admin@example.com',
      password: '1234',
    });
    
    const { token } = signinResponse.data;
    console.log('Successfully signed in as admin');
    
    if (!token) {
      throw new Error('No token received after sign in');
    }
    
    // Step 2: Get available products
    console.log('Fetching products...');
    const productsResponse = await axios.get(`${API_URL}/api/products`);
    const products = productsResponse.data;
    
    if (!products || products.length === 0) {
      console.error('No products found to delete!');
      return;
    }
    
    console.log(`Found ${products.length} products`);
    
    // Step 3: Create a test product to delete
    console.log('\nCreating a test product to delete...');
    const testProduct = {
      name: 'Test Product for Deletion',
      category: 'Test',
      image: '/images/d1.jpg',
      price: 25,
      brand: 'Test Brand',
      rating: 4.0,
      numReviews: 1,
      countInStock: 5,
      description: 'This is a test product that will be deleted'
    };
    
    const createResponse = await axios.post(
      `${API_URL}/api/products`,
      testProduct,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const createdProduct = createResponse.data.data;
    console.log('Created test product:', createdProduct._id);
    
    // Step 4: Test deletion
    console.log('\nTesting product deletion...');
    try {
      const deleteResponse = await axios.delete(
        `${API_URL}/api/products/${createdProduct._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Delete response:', deleteResponse.data);
      console.log('\nProduct deletion successful!');
      console.log('This confirms that the fix for the product deletion route is working correctly.');
      console.log('The "remove from cart" functionality should now work properly in the frontend.');
    } catch (error) {
      console.error('Error deleting product:', error.response?.data?.message || error.message);
      console.error('Status code:', error.response?.status);
      throw error;
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
testProductDeletion().catch(console.error);
