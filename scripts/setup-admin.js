// scripts/setup-admin.js
// Run this script to set up the initial admin user and sample data

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB6JjHYa9UIX8XHYPDTHeCsKpTU5fx2sA",
  authDomain: "auravein.firebaseapp.com",
  projectId: "auravein",
  storageBucket: "auravein.firebasestorage.app",
  messagingSenderId: "159867463429",
  appId: "1:159867463429:web:772287a9628d1bbb68f96c",
  measurementId: "G-DGYMVG4HTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  try {
    console.log('🚀 Setting up Firebase admin user and sample data...');

    // Admin credentials
    const adminEmail = 'shivapranav432@gmail.com';
    const adminPassword = 'auraveinofficial03'; // Change this to a secure password

    let adminUid;

    try {
      console.log('📧 Creating admin user...');
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      adminUid = userCredential.user.uid;

      // Create admin document
      console.log('👤 Creating admin document...');
      await setDoc(doc(db, "admins", adminUid), {
      name: "Admin User",
      email: adminEmail,
        role: 'admin',
        permissions: ['products', 'orders', 'users', 'coupons', 'categories'],
        createdAt: serverTimestamp(),
        isActive: true
      });

      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log('⚠️  Please change the password after first login!');

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('📧 Admin user already exists, signing in...');
        const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        adminUid = userCredential.user.uid;
        console.log('✅ Successfully signed in as admin');
      } else {
        throw error;
      }
    }

    // Check if sample products already exist
    console.log('📦 Checking for existing products...');
    const existingProducts = await getDocs(collection(db, "products"));
    
    if (!existingProducts.empty) {
      console.log('📦 Sample products already exist, skipping...');
    } else {
      console.log('📦 Creating sample products...');
      const sampleProducts = [
        {
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
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
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];

      for (const product of sampleProducts) {
        await addDoc(collection(db, "products"), product);
      }

      console.log('✅ Sample products created successfully!');
    }

    // Check if sample categories already exist
    console.log('📂 Checking for existing categories...');
    const existingCategories = await getDocs(collection(db, "categories"));
    
    if (!existingCategories.empty) {
      console.log('📂 Sample categories already exist, skipping...');
    } else {
      console.log('📂 Creating sample categories...');
      const sampleCategories = [
        {
          name: "Summer Must Have",
          subtitle: "Starting at ₹999",
          image: "/placeholder.svg?height=300&width=200",
          href: "/shop?category=summer",
          order: 1,
          isActive: true,
          createdAt: serverTimestamp()
        },
        {
          name: "Fantastic Special Style",
          subtitle: "New Collection",
          image: "/placeholder.svg?height=300&width=200",
          href: "/shop?category=special",
          order: 2,
          isActive: true,
          createdAt: serverTimestamp()
        },
        {
          name: "T-SHIRT",
          subtitle: "Premium Quality",
          image: "/placeholder.svg?height=300&width=200",
          href: "/shop?category=tshirts",
          order: 3,
          isActive: true,
          createdAt: serverTimestamp()
        },
        {
          name: "PRINTED T-SHIRT",
          subtitle: "Trending Now",
          image: "/placeholder.svg?height=300&width=200",
          href: "/shop?category=printed",
          order: 4,
          isActive: true,
          createdAt: serverTimestamp()
        }
      ];

      for (const category of sampleCategories) {
        await addDoc(collection(db, "categories"), category);
      }

      console.log('✅ Sample categories created successfully!');
    }

    // Create homepage settings
    console.log('⚙️ Creating homepage settings...');
    await setDoc(doc(db, "settings", "homepage"), {
      featuredProductsCount: 8,
      showCategoryShowcase: true,
      showPromoBanner: true,
      showNewsletter: true,
      showInstagramFeed: true,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Homepage settings created successfully!');

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Login to admin panel at /admin/login');
    console.log('2. Change the admin password');
    console.log('3. Customize products and overlay settings');
    console.log('4. Add your own products and categories');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupAdmin(); 