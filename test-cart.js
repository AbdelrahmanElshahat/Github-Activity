// Test script for cart functionality
const axios = require('axios');

const API_URL = 'http://localhost:5000';

// Test cart functionality
async function testCartFunctionality() {
  try {
    // Step 1: Get available products
    console.log('Fetching products...');
    const productsResponse = await axios.get(`${API_URL}/api/products`);
    const products = productsResponse.data;
    
    if (!products || products.length === 0) {
      console.error('No products found!');
      return;
    }
    
    console.log(`Found ${products.length} products`);
    console.log('First product:', JSON.stringify(products[0], null, 2));
    
    // Step 2: Get details of the first product
    const firstProduct = products[0];
    console.log(`Testing with product: ${firstProduct.name}`);
    
    try {
      console.log(`Requesting details for product ID: ${firstProduct._id}`);
      const productDetailsResponse = await axios.get(`${API_URL}/api/products/${firstProduct._id}`);
      const productDetails = productDetailsResponse.data;
      
      console.log('Product details retrieved successfully');
      console.log(`Product ID: ${productDetails._id}`);
      console.log(`Product Name: ${productDetails.name}`);
      console.log(`Product Price: $${productDetails.price}`);
      console.log(`Stock: ${productDetails.countInStock}`);
      
      // Step 3: Simulate adding to cart
      console.log('\nSimulating adding product to cart...');
      
      // Create a cart item object
      const cartItem = {
        product: productDetails._id,
        name: productDetails.name,
        image: productDetails.image,
        price: productDetails.price,
        countInStock: productDetails.countInStock,
        qty: 1
      };
      
      console.log('Cart Item:', cartItem);
      
      // In the browser, this would be saved to the Redux store and cookies
      const cartItems = [cartItem];
      console.log('Cart Items:', cartItems);
      
      // Calculate cart summary
      const itemsCount = cartItems.reduce((a, c) => a + Number(c.qty), 0);
      const itemsPrice = cartItems.reduce((a, c) => a + Number(c.price) * Number(c.qty), 0).toFixed(2);
      
      console.log('\nCart Summary:');
      console.log(`Total Items: ${itemsCount}`);
      console.log(`Total Price: $${itemsPrice}`);
      
      console.log('\nIn a real browser environment:');
      console.log('1. The item would be added to the Redux store');
      console.log('2. The cart items would be saved to cookies');
      console.log('3. The user would be redirected to the cart page');
      
      console.log('\nTest completed successfully!');
      console.log('You can now try to access these URLs in your browser:');
      console.log(`Product details: http://localhost:3000/product/${productDetails._id}`);
      console.log('Add to cart by clicking the "Add to Cart" button');
      console.log('Then check the cart: http://localhost:3000/cart');
      
    } catch (detailError) {
      console.error('Error fetching product details:', detailError.response?.data || detailError.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCartFunctionality().catch(console.error);
