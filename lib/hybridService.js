// lib/hybridService.js
// Hybrid service that uses Firebase Auth + localStorage for immediate functionality

import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Local storage keys
const STORAGE_KEYS = {
  USERS: 'auravein_users',
  PRODUCTS: 'auravein_products',
  ORDERS: 'auravein_orders',
  COUPONS: 'auravein_coupons',
  CURRENT_USER: 'auravein_current_user'
};

// Helper functions
const safeGetItem = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};

const safeSetItem = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Authentication
export const loginUser = async (email, password) => {
  try {
    // Try Firebase Auth first
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from localStorage
    const users = safeGetItem(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email);
    
    if (user) {
      // Clear any existing admin session first
      localStorage.removeItem('admin_session');
      safeSetItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    } else {
      // Create user if not exists - NEVER set isAdmin for regular users
      const newUser = {
        id: userCredential.user.uid,
        name: email.split('@')[0],
        email,
        isAdmin: false, // Regular users are never admin
        role: 'user', // Regular users have 'user' role
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      safeSetItem(STORAGE_KEYS.USERS, users);
      // Clear any existing admin session first
      localStorage.removeItem('admin_session');
      safeSetItem(STORAGE_KEYS.CURRENT_USER, newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password || 'password123'
    );

    // Add to localStorage - NEVER create admin users through registration
    const users = safeGetItem(STORAGE_KEYS.USERS) || [];
    const newUser = {
      id: userCredential.user.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isAdmin: false, // Registration never creates admin users
      role: 'user', // Registration always creates regular users
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    safeSetItem(STORAGE_KEYS.USERS, users);
    // Clear any existing admin session first
    localStorage.removeItem('admin_session');
    safeSetItem(STORAGE_KEYS.CURRENT_USER, newUser);
    
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    safeSetItem(STORAGE_KEYS.CURRENT_USER, null);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return safeGetItem(STORAGE_KEYS.CURRENT_USER);
};

// Products
export const getProducts = () => {
  return safeGetItem(STORAGE_KEYS.PRODUCTS) || [];
};

export const addProduct = async (productData) => {
  const products = getProducts();
  const newProduct = {
    id: Date.now().toString(),
    ...productData,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  products.push(newProduct);
  safeSetItem(STORAGE_KEYS.PRODUCTS, products);
  return newProduct;
};

export const updateProduct = async (productId, productData) => {
  const products = getProducts();
  const updatedProducts = products.map(p => 
    p.id === productId ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
  );
  safeSetItem(STORAGE_KEYS.PRODUCTS, updatedProducts);
  return { id: productId, ...productData };
};

export const deleteProduct = async (productId) => {
  const products = getProducts();
  const updatedProducts = products.map(p => 
    p.id === productId ? { ...p, isActive: false } : p
  );
  safeSetItem(STORAGE_KEYS.PRODUCTS, updatedProducts);
  return true;
};

// Users
export const getUsers = () => {
  return safeGetItem(STORAGE_KEYS.USERS) || [];
};

export const getUserByEmail = async (email) => {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
};

// Orders
export const getOrders = () => {
  return safeGetItem(STORAGE_KEYS.ORDERS) || [];
};

export const addOrder = async (orderData) => {
  const orders = getOrders();
  const newOrder = {
    id: Date.now().toString(),
    ...orderData,
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  safeSetItem(STORAGE_KEYS.ORDERS, orders);
  return newOrder;
};

// Coupons
export const getCoupons = () => {
  return safeGetItem(STORAGE_KEYS.COUPONS) || [];
};

export const addCoupon = async (couponData) => {
  const coupons = getCoupons();
  const newCoupon = {
    id: Date.now().toString(),
    ...couponData,
    createdAt: new Date().toISOString(),
    isActive: true
  };
  coupons.push(newCoupon);
  safeSetItem(STORAGE_KEYS.COUPONS, coupons);
  return newCoupon;
};

export const updateCoupon = async (couponId, couponData) => {
  const coupons = getCoupons();
  const updatedCoupons = coupons.map(c => 
    c.id === couponId ? { ...c, ...couponData, updatedAt: new Date().toISOString() } : c
  );
  safeSetItem(STORAGE_KEYS.COUPONS, updatedCoupons);
  return { id: couponId, ...couponData };
};

export const deleteCoupon = async (couponId) => {
  const coupons = getCoupons();
  const updatedCoupons = coupons.map(c => 
    c.id === couponId ? { ...c, isActive: false } : c
  );
  safeSetItem(STORAGE_KEYS.COUPONS, updatedCoupons);
  return true;
};

// Initialize default data
export const initializeData = () => {
  // Initialize admin user if not exists
  const users = getUsers();
  if (users.length === 0) {
    const adminUser = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@auravein.com',
      phone: '+919059731884',
      isAdmin: true,
      createdAt: new Date().toISOString()
    };
    safeSetItem(STORAGE_KEYS.USERS, [adminUser]);
  }

  // Initialize sample products if not exists
  const products = getProducts();
  if (products.length === 0) {
    const sampleProducts = [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        price: 999,
        originalPrice: 1299,
        discount: 23,
        image: 'https://via.placeholder.com/400x500/ffffff/000000?text=T-Shirt',
        images: ['https://via.placeholder.com/400x500/ffffff/000000?text=T-Shirt', 'https://via.placeholder.com/400x500/ffffff/000000?text=T-Shirt+2'],
        rating: 4.5,
        reviews: 128,
        category: 'T-Shirts',
        description: 'Premium cotton classic white t-shirt with perfect fit.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Gray'],
        stock: 50,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Denim Jacket',
        price: 2499,
        originalPrice: 2999,
        discount: 17,
        image: 'https://via.placeholder.com/400x500/ffffff/000000?text=Jacket',
        images: ['https://via.placeholder.com/400x500/ffffff/000000?text=Jacket', 'https://via.placeholder.com/400x500/ffffff/000000?text=Jacket+2'],
        rating: 4.8,
        reviews: 89,
        category: 'Jackets',
        description: 'Stylish denim jacket perfect for any casual occasion.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Black'],
        stock: 25,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    safeSetItem(STORAGE_KEYS.PRODUCTS, sampleProducts);
  }
}; 