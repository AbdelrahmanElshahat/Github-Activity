// Script to add products to the e-commerce database
const axios = require('axios');

const API_URL = 'http://localhost:5000';
let token;

// Sample products to add
const products = [
  {
    name: 'Slim Shirt',
    category: 'Shirts',
    image: '/images/d1.jpg',
    price: 60,
    brand: 'Nike',
    rating: 4.5,
    numReviews: 10,
    countInStock: 6,
    description: 'High quality slim fit shirt'
  },
  {
    name: 'Fit Shirt',
    category: 'Shirts',
    image: '/images/d2.jpg',
    price: 50,
    brand: 'Adidas',
    rating: 4.2,
    numReviews: 5,
    countInStock: 8,
    description: 'Comfortable fit shirt for everyday wear'
  },
  {
    name: 'Best Pants',
    category: 'Pants',
    image: '/images/d3.jpg',
    price: 70,
    brand: 'Puma',
    rating: 4.5,
    numReviews: 8,
    countInStock: 6,
    description: 'Premium quality pants for all occasions'
  },
  {
    name: 'Running Shoes',
    category: 'Shoes',
    image: '/images/p1.jpg',
    price: 120,
    brand: 'Nike',
    rating: 4.8,
    numReviews: 15,
    countInStock: 10,
    description: 'Professional running shoes with excellent support'
  },
  {
    name: 'Casual Shoes',
    category: 'Shoes',
    image: '/images/p2.jpg',
    price: 90,
    brand: 'Adidas',
    rating: 4.6,
    numReviews: 12,
    countInStock: 8,
    description: 'Stylish casual shoes for everyday wear'
  }
];

// Step 1: Create admin user
async function createAdmin() {
  try {
    const response = await axios.get(`${API_URL}/api/users/createadmin`);
    console.log('Admin created or already exists:', response.data);
    return true;
  } catch (error) {
    console.log('Admin might already exist:', error.response?.data || error.message);
    return true; // Continue anyway, as admin might already exist
  }
}

// Step 2: Sign in as admin
async function signIn() {
  try {
    const response = await axios.post(`${API_URL}/api/users/signin`, {
      email: 'admin@example.com',
      password: '1234',
    });
    token = response.data.token;
    console.log('Successfully signed in as admin');
    return true;
  } catch (error) {
    console.error('Failed to sign in:', error.response?.data || error.message);
    return false;
  }
}

// Step 3: Add products
async function addProducts() {
  let addedCount = 0;
  
  for (const product of products) {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        product,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log(`Added product: ${product.name}`);
      addedCount++;
    } catch (error) {
      console.error(`Failed to add product ${product.name}:`, error.response?.data || error.message);
    }
  }
  
  console.log(`Successfully added ${addedCount} out of ${products.length} products`);
}

// Run the script
async function run() {
  const adminCreated = await createAdmin();
  if (adminCreated) {
    const signedIn = await signIn();
    if (signedIn) {
      await addProducts();
    }
  }
}

run().catch(console.error);
