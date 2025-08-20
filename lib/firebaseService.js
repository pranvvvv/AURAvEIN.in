// lib/firebaseService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from './firebase';

// Fallback local data for testing when Firestore is unavailable
const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: "BROWN TIGER T-SHIRT",
    price: 4495,
    originalPrice: 5495,
    discount: 18,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    videoUrl: "/placeholder.mp4",
    rating: 4,
    reviews: 128,
    category: "t-shirts",
    description: "Premium oversized unisex t-shirt featuring a detailed tiger print. Made from 100% organic cotton for maximum comfort and durability.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Brown", "Black", "White"],
    stock: 50,
    isActive: true,
    isFeatured: true,
    overlaySettings: {
      showSizeSelector: true,
      showColorSelector: true,
      showAddToCart: true,
      defaultSize: 'M',
      defaultColor: 'Brown',
      buttonText: 'Add to Cart',
      buttonIcon: 'shopping-bag'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: "RED HUMMINGBIRD T-SHIRT",
    price: 4495,
    originalPrice: 5495,
    discount: 18,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RMkXrTxnA1vpz17GZLeE524Ifu4M1Q.png",
      "/placeholder.svg?height=400&width=400",
    ],
    videoUrl: "/placeholder.mp4",
    rating: 5,
    reviews: 89,
    category: "t-shirts",
    description: "Oversized unisex t-shirt with vibrant hummingbird design. Premium quality fabric with a relaxed fit.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Red", "Black", "White"],
    stock: 45,
    isActive: true,
    isFeatured: true,
    overlaySettings: {
      showSizeSelector: true,
      showColorSelector: true,
      showAddToCart: true,
      defaultSize: 'L',
      defaultColor: 'Red',
      buttonText: 'Add to Cart',
      buttonIcon: 'shopping-bag'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: "NAVY STARLING T-SHIRT",
    price: 3995,
    originalPrice: 4995,
    discount: 20,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400"],
    videoUrl: "/placeholder.mp4",
    rating: 4,
    reviews: 67,
    category: "t-shirts",
    description: "Navy blue oversized t-shirt featuring a detailed starling bird design. Perfect for casual everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Black", "White"],
    stock: 35,
    isActive: true,
    isFeatured: true,
    overlaySettings: {
      showSizeSelector: true,
      showColorSelector: false,
      showAddToCart: true,
      defaultSize: 'M',
      defaultColor: 'Navy',
      buttonText: 'Buy Now',
      buttonIcon: 'shopping-bag'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const FALLBACK_CATEGORIES = [
  {
    id: '1',
    name: "Summer Must Have",
    subtitle: "Starting at ₹999",
    image: "/placeholder.svg?height=300&width=200",
    href: "/shop?category=summer",
    order: 1,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: "Fantastic Special Style",
    subtitle: "New Collection",
    image: "/placeholder.svg?height=300&width=200",
    href: "/shop?category=special",
    order: 2,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: "T-SHIRT",
    subtitle: "Premium Quality",
    image: "/placeholder.svg?height=300&width=200",
    href: "/shop?category=tshirts",
    order: 3,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: '4',
    name: "PRINTED T-SHIRT",
    subtitle: "Trending Now",
    image: "/placeholder.svg?height=300&width=200",
    href: "/shop?category=printed",
    order: 4,
    isActive: true,
    createdAt: new Date()
  }
];

// Helper function to check if Firestore is available
const isFirestoreAvailable = () => {
  try {
    const isAvailable = db && typeof db.collection === 'function';
    console.log('isFirestoreAvailable check:', isAvailable, 'db exists:', !!db, 'db.collection is function:', typeof db?.collection === 'function');
    return isAvailable;
  } catch (error) {
    console.log('isFirestoreAvailable error:', error);
    return false;
  }
};

// Helper function to read products from data.ts file
export const getProductsFromDataFile = async () => {
  try {
    // Import the products from data.ts dynamically
    const { products } = await import('./data');
    return products || [];
  } catch (error) {
    console.error('Error reading from data.ts:', error);
    return FALLBACK_PRODUCTS;
  }
};

// ===== PRODUCT MANAGEMENT =====

export const addProduct = async (productData) => {
  try {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isFeatured: productData.isFeatured || false,
      overlaySettings: {
        showSizeSelector: productData.overlaySettings?.showSizeSelector ?? true,
        showColorSelector: productData.overlaySettings?.showColorSelector ?? true,
        showAddToCart: productData.overlaySettings?.showAddToCart ?? true,
        defaultSize: productData.overlaySettings?.defaultSize || 'M',
        defaultColor: productData.overlaySettings?.defaultColor || 'Default',
        buttonText: productData.overlaySettings?.buttonText || 'Add to Cart',
        buttonIcon: productData.overlaySettings?.buttonIcon || 'shopping-bag'
      }
    };

    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      
      // Store in localStorage for persistence
      const existingProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      existingProducts.push(newProduct);
      localStorage.setItem('fallback_products', JSON.stringify(existingProducts));
      
      // Update data.ts file via API (optimized)
      fetch('/api/update-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', product: newProduct })
      }).catch(error => console.error('Background data.ts update failed:', error));
      
      return newProduct;
    }

    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      isFeatured: productData.isFeatured || false,
      overlaySettings: {
        showSizeSelector: productData.overlaySettings?.showSizeSelector ?? true,
        showColorSelector: productData.overlaySettings?.showColorSelector ?? true,
        showAddToCart: productData.overlaySettings?.showAddToCart ?? true,
        defaultSize: productData.overlaySettings?.defaultSize || 'M',
        defaultColor: productData.overlaySettings?.defaultColor || 'Default',
        buttonText: productData.overlaySettings?.buttonText || 'Add to Cart',
        buttonIcon: productData.overlaySettings?.buttonIcon || 'shopping-bag'
      }
    });
    
    const productWithId = { id: docRef.id, ...productData };
    
    // Update data.ts file via API (optimized - non-blocking)
    fetch('/api/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', product: productWithId })
    }).catch(error => console.error('Background data.ts update failed:', error));
    
    return productWithId;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};

// PRODUCTS
export const getProducts = async () => {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (e) {
    // Fallback to local data.ts
    try {
      const { products } = await import('./data');
      return products;
    } catch (err) {
      console.error('Failed to load products from data.ts:', err);
      return [];
    }
  }
};

export const getFeaturedProducts = async () => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using data.ts file');
      const dataProducts = await getProductsFromDataFile();
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : dataProducts;
      return products.filter(p => p.isFeatured);
    }

    const q = query(
      collection(db, "products"), 
      where("isActive", "==", true),
      where("isFeatured", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error("Error getting featured products: ", error);
    console.warn('Falling back to data.ts file');
    const dataProducts = await getProductsFromDataFile();
    return dataProducts.filter(p => p.isFeatured);
  }
};

export const getProductById = async (productId) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using data.ts file');
      const dataProducts = await getProductsFromDataFile();
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : dataProducts;
      return products.find(p => p.id === productId) || null;
    }

    const docRef = doc(db, "products", productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting product: ", error);
    console.warn('Falling back to data.ts file');
    const dataProducts = await getProductsFromDataFile();
    const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
    const products = fallbackProducts.length > 0 ? fallbackProducts : dataProducts;
    return products.find(p => p.id === productId) || null;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const updatedProduct = { id: productId, ...productData, updatedAt: new Date() };

    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : FALLBACK_PRODUCTS;
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, ...productData, updatedAt: new Date() } : p
      );
      localStorage.setItem('fallback_products', JSON.stringify(updatedProducts));
      
      // Update data.ts file via API (optimized - non-blocking)
      fetch('/api/update-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', product: updatedProduct })
      }).catch(error => console.error('Background data.ts update failed:', error));
      
      return updatedProduct;
    }

    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    
    // Update data.ts file via API (optimized - non-blocking)
    fetch('/api/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', product: updatedProduct })
    }).catch(error => console.error('Background data.ts update failed:', error));
    
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : FALLBACK_PRODUCTS;
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, isActive: false, updatedAt: new Date() } : p
      );
      localStorage.setItem('fallback_products', JSON.stringify(updatedProducts));
      
      // Update data.ts file via API (optimized - non-blocking)
      const productToRemove = products.find(p => p.id === productId);
      if (productToRemove) {
        fetch('/api/update-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'remove', product: productToRemove })
        }).catch(error => console.error('Background data.ts update failed:', error));
      }
      
      return true;
    }

    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { 
      isActive: false,
      updatedAt: serverTimestamp()
    });
    
    // Update data.ts file via API (optimized - non-blocking)
    const productDoc = await getDoc(productRef);
    if (productDoc.exists()) {
      const productData = productDoc.data();
      fetch('/api/update-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', product: { id: productId, ...productData } })
      }).catch(error => console.error('Background data.ts update failed:', error));
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};

export const toggleProductFeatured = async (productId, isFeatured) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : FALLBACK_PRODUCTS;
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, isFeatured, updatedAt: new Date() } : p
      );
      localStorage.setItem('fallback_products', JSON.stringify(updatedProducts));
      
      // Update data.ts file via API
      try {
        const productToUpdate = updatedProducts.find(p => p.id === productId);
        if (productToUpdate) {
          await fetch('/api/update-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'update',
              product: productToUpdate
            })
          });
          console.log('Successfully updated product in data.ts:', productToUpdate.name);
        }
      } catch (error) {
        console.error('Error updating data.ts:', error);
      }
      
      return true;
    }

    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { 
      isFeatured,
      updatedAt: serverTimestamp()
    });
    
    // Update data.ts file via API
    try {
      const productDoc = await getDoc(productRef);
      if (productDoc.exists()) {
        const productData = productDoc.data();
        await fetch('/api/update-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            product: { id: productId, ...productData }
          })
        });
        console.log('Successfully updated product in data.ts:', productData.name);
      }
    } catch (error) {
      console.error('Error updating data.ts:', error);
    }
    
    return true;
  } catch (error) {
    console.error("Error toggling featured status: ", error);
    throw error;
  }
};

// ===== REAL-TIME PRODUCT LISTENERS =====

export const subscribeToProducts = (callback) => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available, using data.ts file');
    getProductsFromDataFile().then(dataProducts => {
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : dataProducts;
      callback(products);
    });
    return () => {}; // Return empty unsubscribe function
  }

  const q = query(
    collection(db, "products"), 
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }));
    callback(products);
  });
};

export const subscribeToFeaturedProducts = (callback) => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore not available, using data.ts file');
    getProductsFromDataFile().then(dataProducts => {
      const fallbackProducts = JSON.parse(localStorage.getItem('fallback_products') || '[]');
      const products = fallbackProducts.length > 0 ? fallbackProducts : dataProducts;
      const featuredProducts = products.filter(p => p.isFeatured);
      callback(featuredProducts);
    });
    return () => {}; // Return empty unsubscribe function
  }

  const q = query(
    collection(db, "products"), 
    where("isActive", "==", true),
    where("isFeatured", "==", true),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    }));
    callback(products);
  });
};

// ===== ADMIN AUTHENTICATION =====

export const loginAdmin = async (email, password) => {
  try {
    console.log('loginAdmin called with:', email, password)
    
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local auth fallback');
      console.log('Checking admin credentials:', email === 'shivapranav432@gmail.com', password === 'auraveinofficial03')
      
      // Simple local admin check for testing
      if (email === 'shivapranav432@gmail.com' && password === 'auraveinofficial03') {
        console.log('Admin credentials match!')
        
        // Clear any existing user session first
        localStorage.removeItem('auravein_current_user');
        
        const adminData = {
          id: 'local-admin',
          uid: 'local-admin',
          email: email,
          name: 'Admin User',
          role: 'admin',
          isAdmin: true
        };
        // Store admin session in localStorage
        localStorage.setItem('admin_session', JSON.stringify(adminData));
        console.log('Admin session stored in localStorage')
        return adminData;
      }
      console.log('Admin credentials do not match')
      throw new Error("Invalid credentials");
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user is admin
    const userDoc = await getDoc(doc(db, "admins", userCredential.user.uid));
    if (!userDoc.exists()) {
      throw new Error("Access denied. Admin privileges required.");
    }
    
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      ...userDoc.data()
    };
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local auth fallback');
      return {
        uid: 'local-admin',
        email: adminData.email,
        name: adminData.name,
        role: 'admin'
      };
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      adminData.email, 
      adminData.password
    );

    // Create admin document
    await setDoc(doc(db, "admins", userCredential.user.uid), {
      name: adminData.name,
      email: adminData.email,
      role: 'admin',
      permissions: adminData.permissions || ['products', 'orders', 'users', 'coupons'],
      createdAt: serverTimestamp(),
      isActive: true
    });

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: adminData.name,
      role: 'admin'
    };
  } catch (error) {
    console.error("Admin creation error:", error);
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local auth fallback');
      // Clear admin session from localStorage
      localStorage.removeItem('admin_session');
      return;
    }
    await signOut(auth);
  } catch (error) {
    console.error("Admin logout error:", error);
    throw error;
  }
};

export const getCurrentAdmin = () => {
  return new Promise((resolve) => {
    console.log('getCurrentAdmin called')
    
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local auth fallback');
      // Check localStorage for admin session
      const adminSession = localStorage.getItem('admin_session');
      console.log('Admin session from localStorage:', adminSession)
      if (adminSession) {
        const parsedSession = JSON.parse(adminSession);
        console.log('Parsed admin session:', parsedSession)
        // Ensure the admin data has the correct structure
        const adminData = {
          ...parsedSession,
          id: parsedSession.id || parsedSession.uid || 'local-admin'
        };
        console.log('Returning admin data:', adminData)
        resolve(adminData);
      } else {
        console.log('No admin session found in localStorage')
        resolve(null);
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", user.uid));
          if (adminDoc.exists()) {
            resolve({
              uid: user.uid,
              email: user.email,
              ...adminDoc.data()
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error("Error getting admin data:", error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

// ===== CATEGORY MANAGEMENT =====

export const addCategory = async (categoryData) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const newCategory = {
        id: Date.now().toString(),
        ...categoryData,
        createdAt: new Date(),
        isActive: true
      };
      
      const existingCategories = JSON.parse(localStorage.getItem('fallback_categories') || '[]');
      existingCategories.push(newCategory);
      localStorage.setItem('fallback_categories', JSON.stringify(existingCategories));
      
      return newCategory;
    }

    const docRef = await addDoc(collection(db, "categories"), {
      ...categoryData,
      createdAt: serverTimestamp(),
      isActive: true
    });
    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("Error adding category: ", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local data fallback');
      const fallbackCategories = JSON.parse(localStorage.getItem('fallback_categories') || '[]');
      return fallbackCategories.length > 0 ? fallbackCategories : FALLBACK_CATEGORIES;
    }

    const q = query(
      collection(db, "categories"), 
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error("Error getting categories: ", error);
    console.warn('Falling back to local data');
    return FALLBACK_CATEGORIES;
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const fallbackCategories = JSON.parse(localStorage.getItem('fallback_categories') || '[]');
      const categories = fallbackCategories.length > 0 ? fallbackCategories : FALLBACK_CATEGORIES;
      const updatedCategories = categories.map(c => 
        c.id === categoryId ? { ...c, ...categoryData, updatedAt: new Date() } : c
      );
      localStorage.setItem('fallback_categories', JSON.stringify(updatedCategories));
      return { id: categoryId, ...categoryData };
    }

    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: serverTimestamp()
    });
    return { id: categoryId, ...categoryData };
  } catch (error) {
    console.error("Error updating category: ", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const fallbackCategories = JSON.parse(localStorage.getItem('fallback_categories') || '[]');
      const categories = fallbackCategories.length > 0 ? fallbackCategories : FALLBACK_CATEGORIES;
      const updatedCategories = categories.map(c => 
        c.id === categoryId ? { ...c, isActive: false, updatedAt: new Date() } : c
      );
      localStorage.setItem('fallback_categories', JSON.stringify(updatedCategories));
      return true;
    }

    const categoryRef = doc(db, "categories", categoryId);
    await updateDoc(categoryRef, { 
      isActive: false,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw error;
  }
};

// ===== HOMEPAGE SETTINGS =====

export const getHomepageSettings = async () => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local data fallback');
      const settings = localStorage.getItem('homepage_settings');
      if (settings) {
        return JSON.parse(settings);
      }
      // Return default settings
      return {
        featuredProductsCount: 8,
        showCategoryShowcase: true,
        showPromoBanner: true,
        showNewsletter: true,
        showInstagramFeed: true
      };
    }

    const docRef = doc(db, "settings", "homepage");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return default settings
      return {
        featuredProductsCount: 8,
        showCategoryShowcase: true,
        showPromoBanner: true,
        showNewsletter: true,
        showInstagramFeed: true
      };
    }
  } catch (error) {
    console.error("Error getting homepage settings: ", error);
    return {
      featuredProductsCount: 8,
      showCategoryShowcase: true,
      showPromoBanner: true,
      showNewsletter: true,
      showInstagramFeed: true
    };
  }
};

export const updateHomepageSettings = async (settings) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      localStorage.setItem('homepage_settings', JSON.stringify({
        ...settings,
        updatedAt: new Date()
      }));
      return true;
    }

    await setDoc(doc(db, "settings", "homepage"), {
      ...settings,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating homepage settings: ", error);
    throw error;
  }
};

// ===== EXISTING FUNCTIONS (Users, Orders, Coupons) =====

// Users
export const addUser = async (userData) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date()
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('fallback_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('fallback_users', JSON.stringify(existingUsers));
      
      return newUser;
    }

    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error("Error adding user: ", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local data fallback');
      return JSON.parse(localStorage.getItem('fallback_users') || '[]');
    }

    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error("Error getting users: ", error);
    return [];
  }
};

export const getUserByEmail = async (email) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local data fallback');
      const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
      return users.find(u => u.email === email) || null;
    }

    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting user by email: ", error);
    return null;
  }
};

// Orders
export const addOrder = async (orderData) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        createdAt: new Date()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('fallback_orders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('fallback_orders', JSON.stringify(existingOrders));
      
      return newOrder;
    }

    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error("Error adding order: ", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local data fallback');
      return JSON.parse(localStorage.getItem('fallback_orders') || '[]');
    }

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date()
    }));
  } catch (error) {
    console.error("Error getting orders: ", error);
    return [];
  }
};

// COUPONS
export const getCoupons = async () => {
  try {
    const res = await fetch('/api/coupons');
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (e) {
    // Fallback to local coupons-data.ts
    try {
      const { coupons } = await import('./coupons-data');
      return coupons;
    } catch (err) {
      console.error('Failed to load coupons from coupons-data.ts:', err);
      return [];
    }
  }
};

export const addCoupon = async (couponData) => {
  try {
    // Save to MongoDB via API
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    
    if (!res.ok) throw new Error('Failed to add coupon');
    
    const result = await res.json();
    
    // Background update to coupons-data.ts
    fetch('/api/update-coupons-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', coupon: couponData })
    }).catch(error => console.error('Background coupons-data.ts update failed:', error));
    
    return result;
  } catch (error) {
    console.error("Error adding coupon: ", error);
    throw error;
  }
};

export const updateCoupon = async (couponId, couponData) => {
  try {
    // Update in MongoDB via API
    const res = await fetch(`/api/coupons/${couponId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponData)
    });
    
    if (!res.ok) throw new Error('Failed to update coupon');
    
    const result = await res.json();
    
    // Background update to coupons-data.ts
    fetch('/api/update-coupons-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', couponId, coupon: couponData })
    }).catch(error => console.error('Background coupons-data.ts update failed:', error));
    
    return result;
  } catch (error) {
    console.error("Error updating coupon: ", error);
    throw error;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const fallbackCoupons = JSON.parse(localStorage.getItem('fallback_coupons') || '[]');
      const updatedCoupons = fallbackCoupons.map(c => 
        c.id === couponId ? { ...c, isActive: false, updatedAt: new Date() } : c
      );
      localStorage.setItem('fallback_coupons', JSON.stringify(updatedCoupons));
      return true;
    }

    const couponRef = doc(db, "coupons", couponId);
    await updateDoc(couponRef, { 
      isActive: false,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error deleting coupon: ", error);
    throw error;
  }
};

// Validate and apply coupon
export const validateCoupon = async (couponCode, cartTotal) => {
  try {
    const coupons = await getCoupons();
    const coupon = coupons.find(c => c.code === couponCode && c.isActive);
    
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }
    
    // Check if coupon is expired
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'Coupon has expired' };
    }
    
    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return { 
        valid: false, 
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required` 
      };
    }
    
    // Check maximum usage
    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }
    
    return {
      valid: true,
      coupon: {
        ...coupon,
        discountAmount: Math.min(discountAmount, cartTotal)
      },
      message: `Discount of ₹${discountAmount.toFixed(2)} applied`
    };
  } catch (error) {
    console.error("Error validating coupon: ", error);
    return { valid: false, message: 'Error validating coupon' };
  }
};

// Cart (for user-specific carts)
export const saveUserCart = async (userId, cartItems) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      localStorage.setItem(`cart_${userId}`, JSON.stringify({
        items: cartItems,
        updatedAt: new Date()
      }));
      return true;
    }

    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, {
      items: cartItems,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error saving cart: ", error);
    throw error;
  }
};

export const getUserCart = async (userId) => {
  try {
    if (!isFirestoreAvailable()) {
      console.warn('Firestore not available, using local storage fallback');
      const cartData = localStorage.getItem(`cart_${userId}`);
      if (cartData) {
        return JSON.parse(cartData).items || [];
      }
      return [];
    }

    const cartRef = doc(db, "carts", userId);
    const cartDoc = await getDoc(cartRef);
    if (cartDoc.exists()) {
      return cartDoc.data().items || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting user cart: ", error);
    return [];
  }
};

 